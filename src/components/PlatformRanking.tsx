import { SongList } from './SongList';
import { AudioLines, MessageCircleWarning } from 'lucide-react';
import { useState, useEffect } from 'react';

// SongList 컴포넌트가 기대하는 Song 인터페이스
interface Song {
  rank: number;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  thumbnailUrl: string;
  platformId: string; // YouTube video ID or Spotify track ID
}

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

// Spotify API 응답의 item 구조에 맞는 인터face
interface SpotifyTrackItem {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  id: string; // Spotify track ID
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

// 밀리초를 분:초 형식으로 변환하는 헬퍼 함수 (Spotify용)
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${(Number(seconds) < 10 ? '0' : '')}${seconds}`;
};

export function PlatformRanking() {
  const [youtubeSongs, setYoutubeSongs] = useState<Song[]>([]);
  const [spotifySongs, setSpotifySongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const youtubeRes = await fetch('/data/youtube-ranking.json');
        if (!youtubeRes.ok) {
          throw new Error(`Failed to fetch YouTube ranking: ${youtubeRes.statusText}`);
        }
        const youtubeRawData = await youtubeRes.json();
        setYoutubeSongs(transformYouTubeData(youtubeRawData.items));

        const spotifyRes = await fetch('/data/spotify-ranking.json');
        if (!spotifyRes.ok) {
          throw new Error(`Failed to fetch Spotify ranking: ${spotifyRes.statusText}`);
        }
        const spotifyRawData = await spotifyRes.json();
        setSpotifySongs(transformSpotifyData(spotifyRawData.items));

      } catch (err) {
        console.error('Failed to fetch songs:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl py-12 text-center text-white">
        <p>Loading Vocaloid songs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl py-12 text-center text-red-500">
        <p>Error loading songs: {error}</p>
        <p>Please ensure your JSON files are correctly placed in public/data and have the expected structure.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl py-12">

      {/* YouTube Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <AudioLines className="text-white" />
          <h3 className="text-2xl font-bold text-white">YouTube Ranking</h3>
          <div className="group relative flex items-center -translate-y-3">
            <MessageCircleWarning className="text-white" size={20}/>
            <div className="absolute left-full top-1/2 z-10 ml-4 -translate-y-1/2 scale-0 transform rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
              <div className="absolute -left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white"/>
              유튜브 랭킹은 키워드를 통해서 특수한 알고리즘을 통해서 순위를 선정하고 있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {youtubeSongs.map((song) => (
            <SongList key={song.rank} song={song} platformType="youtube" />
          ))}
        </div>
      </div>

      {/* Spotify Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <AudioLines className="text-white" />
          <h3 className="text-2xl font-bold text-white">Spotify Ranking</h3>
          <div className="group relative flex items-center -translate-y-3">
            <MessageCircleWarning className="text-white" size={20}/>
            <div className="absolute left-full top-1/2 z-10 ml-4 -translate-y-1/2 scale-0 transform rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
              <div className="absolute -left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white"/>
              스포티파이 랭킹은 각 아티스트의 인기도를 기반으로 음악을 가져와서 특수한 알고리즘을 통해서 순위를 선정하고 있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {spotifySongs.map((song) => (
            <SongList key={song.rank} song={song} platformType="spotify" />
          ))}
        </div>
      </div>
    </section>
  );
}
