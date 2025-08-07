
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// ISO 8601 형식의 재생 시간을 초 단위로 변환하는 함수
function parseISO8601Duration(isoDuration: string): number {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    return hours * 3600 + minutes * 60 + seconds;
}

// YouTube API로부터 데이터를 가져오는 함수 (커버, 쇼츠 필터링)
async function getMusicRanking(keyword: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    throw new Error('YouTube API key is not set in environment variables.');
  }

  // 1단계: 동영상 검색 (후보군 확보) - 필터링을 위해 50개 요청
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&type=video&order=viewCount&videoCategoryId=10&maxResults=50&key=${API_KEY}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    const errorData = await searchResponse.json();
    throw new Error(`YouTube API Search Error: ${errorData.error.message}`);
  }
  const searchData = await searchResponse.json();
  if (!searchData.items || searchData.items.length === 0) {
    return [];
  }

  // 2단계: 1차 필터링 (커버 곡 제외)
  const primaryFilteredItems = searchData.items.filter((item: any) => {
    const title = item.snippet.title.toLowerCase();
    const isCoverSong = title.includes('cover') || title.includes('커버');
    return !isCoverSong;
  });

  if (primaryFilteredItems.length === 0) {
    return [];
  }

  // 3단계: 동영상 상세 정보 조회 (재생 시간 확인)
  const videoIds = primaryFilteredItems.map((item: any) => item.id.videoId).join(',');
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`;
  
  const videosResponse = await fetch(videosUrl);
  if (!videosResponse.ok) {
      const errorData = await videosResponse.json();
      throw new Error(`YouTube API Videos Error: ${errorData.error.message}`);
  }
  const videosData = await videosResponse.json();

  const durationMap = new Map<string, number>();
  videosData.items.forEach((item: any) => {
      const durationInSeconds = parseISO8601Duration(item.contentDetails.duration);
      durationMap.set(item.id, durationInSeconds);
  });

  // 4단계: 2차 필터링 (쇼츠 제외) 및 재생 시간 추가
  const finalFilteredItems = primaryFilteredItems
    .map((item: any) => ({
      ...item,
      durationInSeconds: durationMap.get(item.id.videoId) || 0,
    }))
    .filter((item: any) => {
        return item.durationInSeconds > 60;
    });

  // 5. 상위 10개 결과만 반환
  return finalFilteredItems.slice(0, 10);
}

/**
 * POST /api/youtube-ranking/update
 * 키워드 기준 전체 기간의 유튜브 랭킹을 가져와 JSON 파일로 저장합니다.
 */
export async function POST() {
  try {
    const rankingData = await getMusicRanking('vocaloid');

    const dataDir = path.join(process.cwd(), 'public', 'data');
    const filePath = path.join(dataDir, 'youtube-ranking.json');

    await fs.mkdir(dataDir, { recursive: true });

    const dataToSave = {
      lastUpdated: new Date().toISOString(),
      rankingType: 'all-time',
      keyword: 'vocaloid',
      items: rankingData,
    };

    await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));

    return NextResponse.json({
      success: true,
      message: `Successfully updated all-time ranking for keyword "vocaloid"`,
      data: dataToSave,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Ranking update failed:', errorMessage);
    return NextResponse.json(
      { success: false, message: 'Failed to update ranking.', error: errorMessage },
      { status: 500 }
    );
  }
}
