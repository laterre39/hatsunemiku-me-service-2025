import { useState, useEffect } from 'react';
import { SongList } from '@/components/SongList';
import { Song } from '@/types/song';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const youtubeRes = await fetch('/api/youtube-ranking'); // 변경된 부분
        if (!youtubeRes.ok) {
          throw new Error(`Failed to fetch YouTube ranking: ${youtubeRes.statusText}`);
        }
        const youtubeRawData = await youtubeRes.json();
        setYoutubeSongs(transformYouTubeData(youtubeRawData.items));
      } catch (err) {
        console.error('Failed to fetch YouTube songs:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading YouTube songs...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-3"> {/* grid grid-cols-5 gap-4 -> flex flex-col gap-3 */}
        {youtubeSongs.map((song) => (
          <SongList key={song.rank} song={song} platformType="youtube" />
        ))}
    </div>
  );
}