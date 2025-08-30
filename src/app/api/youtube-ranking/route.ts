/* eslint-disable @typescript-eslint/no-explicit-any */

import {NextResponse} from 'next/server';

// Revalidate at most every 6 hours (6 * 60 * 60 = 21600 seconds)
export const revalidate = 21600;

// Helper function to parse ISO 8601 duration to seconds
function parseISO8601Duration(isoDuration: string): number {
    const match = RegExp(/PT(\d+H)?(\d+M)?(\d+S)?/).exec(isoDuration);
    if (!match) return 0;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * GET /api/youtube-ranking
 * Fetches YouTube rankings using highly specific, grouped keywords to ensure accuracy and efficiency.
 */
export async function GET() {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        console.error('YouTube API key is not set in environment variables.');
        return NextResponse.json(
            {success: false, message: 'Server configuration error: YouTube API key is missing.'},
            {status: 500}
        );
    }

    // Highly specific keyword groups to improve search accuracy
    const keywordGroups = [
        'vocaloid | ボーカロイド',
        'hatsune miku | 初音ミク',
        'kagamine rin | 鏡音リン',
        'kagamine len | 鏡音レン',
        'megurine luka | 巡音ルカ',
        'kaito vocaloid | カイト ボーカロイド',
        'meiko vocaloid | メイコ ボーカロイド',
        'gumi | グミ',
        'ia vocaloid | イア ボーカロイド',
        'kasane teto | 重音テト',
        'kafu CeVIO AI | 可不 チェビオAI',
        'sekai CeVIO AI | 星界 チェビオAI',
        'tsurumaki maki | 弦巻マキ',
        'yuzuki yukari | 結月ゆかり',
        'zundamon | ずんだもん',
        'kotonoha akane | 琴葉 茜',
        'kotonoha aoi | 琴葉 葵',
        'project sekai | プロセカ'
    ];

    try {
        // Step 1: Search for top 50 videos for each keyword group concurrently
        const searchPromises = keywordGroups.map(group => {
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(group)}&type=video&order=viewCount&videoCategoryId=10&maxResults=50&key=${API_KEY}`;
            return fetch(searchUrl).then(res => {
                if (!res.ok) {
                    console.error(`YouTube search failed for group: ${group}, status: ${res.status}`);
                    return {items: []};
                }
                return res.json();
            });
        });

        const searchResults = await Promise.all(searchPromises);
        const allItems = searchResults.flatMap(result => result.items);

        // Step 2: Deduplicate results based on videoId
        const uniqueItemsMap = new Map<string, any>();
        allItems.forEach(item => {
            if (item?.id?.videoId && !uniqueItemsMap.has(item.id.videoId)) {
                uniqueItemsMap.set(item.id.videoId, item);
            }
        });
        const uniqueItems = Array.from(uniqueItemsMap.values());

        // Step 3: Primary filter (remove covers, MMD, Project Diva, etc.)
        const nonMusicItems = ['cover', '커버', 'remix', 'mmd', 'project diva', 'diva', 'vrc', 'vrchat', 'バンド', 'english ver'];
        const nonCoverItems = uniqueItems.filter((item: any) => {
            const title = item.snippet.title.toLowerCase();
            return !nonMusicItems.some(filterWord => title.includes(filterWord));
        });

        if (nonCoverItems.length === 0) {
            return NextResponse.json({lastUpdated: new Date().toISOString(), items: []});
        }

        // Step 4: Fetch video details in chunks
        const videoIds = nonCoverItems.map((item: any) => item.id.videoId);
        const CHUNK_SIZE = 50;
        const videoDetailPromises = [];

        for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
            const chunk = videoIds.slice(i, i + CHUNK_SIZE);
            const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${chunk.join(',')}&key=${API_KEY}`;
            videoDetailPromises.push(fetch(videosUrl).then(res => res.json()));
        }

        const videoDetailResults = await Promise.all(videoDetailPromises);
        const videoDetailsMap = new Map<string, any>();
        videoDetailResults.forEach(result => {
            if (result.items) {
                result.items.forEach((item: any) => videoDetailsMap.set(item.id, item));
            }
        });

        // Step 5: Final filter (remove shorts) and combine data
        const finalItems = nonCoverItems
            .map(item => {
                const details = videoDetailsMap.get(item.id.videoId);
                if (!details) return null;

                return {
                    ...item,
                    statistics: details.statistics,
                    durationInSeconds: parseISO8601Duration(details.contentDetails.duration),
                };
            })
            .filter((item): item is NonNullable<typeof item> => {
                return item !== null && item.durationInSeconds > 60;
            });

        // Step 6: Sort by view count (descending)
        finalItems.sort((a, b) => parseInt(b.statistics.viewCount, 10) - parseInt(a.statistics.viewCount, 10));

        // Step 7: Get the top 50 and format the response
        const top50Items = finalItems.slice(0, 50);
        const responseData = {
            lastUpdated: new Date().toISOString(),
            rankingType: 'precise-grouped',
            keywordsUsed: keywordGroups,
            items: top50Items,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Ranking fetch failed:', errorMessage);
        return NextResponse.json(
            {success: false, message: 'Failed to fetch ranking.', error: errorMessage},
            {status: 500}
        );
    }
}
