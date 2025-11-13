import { useState, useEffect } from 'react';
import { SongList } from '@/components/SongList';
import { Song } from '@/types/song';
import { FaExclamationTriangle } from 'react-icons/fa';

// YouTube API 응답의 item 구조에 맞는 인터페이스
interface YouTubePlaylistItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { high: { url: string } };
  };
  durationInSeconds?: number; // durationInSeconds 필드 추가
}

// 초를 분:초 형식으로 변환하는 헬퍼 함수 (YouTube용)
const formatSecondsToMinutesSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// HTML 엔티티를 디코딩하는 헬퍼 함수
const decodeHtmlEntities = (text: string): string => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 간단한 대체만 수행하거나, 라이브러리 사용을 고려
    return text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.documentElement.textContent || '';
};

// YouTube 데이터를 Song 형식으로 변환하는 함수
const transformYouTubeData = (items: YouTubePlaylistItem[]): Song[] => {
  return items.slice(0, 10).map((item, index) => ({
    rank: index + 1,
    title: decodeHtmlEntities(item.snippet.title),
    artist: item.snippet.channelTitle,
    duration: item.durationInSeconds ? formatSecondsToMinutesSeconds(item.durationInSeconds) : 'N/A',
    thumbnailUrl: item.snippet.thumbnails.high.url,
    platformId: item.id.videoId,
  }));
};

export function YouTubeRanking() {
  const [youtubeSongs, setYoutubeSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // boolean 타입으로 변경

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const youtubeRes = await fetch('/api/youtube-ranking');
        if (!youtubeRes.ok) {
          // API 호출 실패 시, 기존 데이터가 없으면 에러 상태로 전환
          if (youtubeSongs.length === 0) {
            setError(true);
          }
          // 기존 데이터가 있으면 아무것도 하지 않고 캐시된 데이터를 유지
          console.error(`Failed to fetch YouTube ranking: ${youtubeRes.statusText}`);
          return; // 함수 실행 종료
        }
        const youtubeRawData = await youtubeRes.json();
        setYoutubeSongs(transformYouTubeData(youtubeRawData.items));
        setError(false); // 성공 시 에러 상태 초기화
      } catch (err) {
        console.error('Failed to fetch YouTube songs:', err);
        // 네트워크 오류 등 fetch 자체가 실패했을 때
        if (youtubeSongs.length === 0) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []); // youtubeSongs를 의존성 배열에서 제거하여 무한 루프 방지

  if (loading) {
    return <p className="text-white text-center">Loading YouTube songs...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-white bg-gray-800/5 rounded-lg p-4">
        <FaExclamationTriangle className="w-8 h-8 text-yellow-400 mb-2" />
        <p className="font-semibold">Youtube 오류</p>
        <p className="text-sm text-gray-400">API 오류로 유튜브 데이터를 가져오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
        {youtubeSongs.map((song) => (
          <SongList key={song.rank} song={song} platformType="youtube" />
        ))}
    </div>
  );
}
