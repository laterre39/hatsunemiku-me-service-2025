import { useState, useEffect } from 'react';
import { SongList } from '@/components/SongList';
import { Song } from '@/types/song';

// Spotify API 응답의 item 구조에 맞는 인터페이스
interface SpotifyTrackItem {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  id: string; // Spotify track ID
}

// 밀리초를 분:초 형식으로 변환하는 헬퍼 함수
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${(Number(seconds) < 10 ? '0' : '')}${seconds}`;
};

// Spotify 데이터를 Song 형식으로 변환하는 함수
const transformSpotifyData = (items: SpotifyTrackItem[]): Song[] => {
  return items.slice(0, 10).map((item, index) => ({
    rank: index + 1,
    title: item.name,
    artist: item.artists.map(artist => artist.name).join(', '),
    album: item.album.name,
    duration: formatDuration(item.duration_ms),
    thumbnailUrl: item.album.images[0]?.url || '/main_bg.png',
    platformId: item.id,
  }));
};

export function SpotifyRanking() {
  const [spotifySongs, setSpotifySongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const spotifyRes = await fetch('/api/spotify-ranking'); // API 엔드포인트 변경
        if (!spotifyRes.ok) {
          throw new Error(`Failed to fetch Spotify ranking: ${spotifyRes.statusText}`);
        }
        const spotifyApiResponse = await spotifyRes.json();

        if (!spotifyApiResponse.success) {
          throw new Error(spotifyApiResponse.message || 'Failed to retrieve ranking data from API');
        }
        
        setSpotifySongs(transformSpotifyData(spotifyApiResponse.data.items)); // 응답 구조 변경에 따른 수정
      } catch (err) {
        console.error('Failed to fetch Spotify songs:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading Spotify songs...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {spotifySongs.map((song) => (
          <SongList key={song.rank} song={song} platformType="spotify" />
        ))}
      </div>
    </div>
  );
}
