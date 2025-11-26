"use client";

import { useState, useEffect } from 'react';
import { SongList } from '@/components/SongList';
import { Song } from '@/types/song';
import { FaExclamationTriangle } from 'react-icons/fa';

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
  const [error, setError] = useState(false); // boolean 타입으로 변경

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const spotifyRes = await fetch('/api/spotify-ranking');
        if (!spotifyRes.ok) {
          if (spotifySongs.length === 0) {
            setError(true);
          }
          console.error(`Failed to fetch Spotify ranking: ${spotifyRes.statusText}`);
          return;
        }
        const spotifyApiResponse = await spotifyRes.json();

        if (!spotifyApiResponse.success) {
          if (spotifySongs.length === 0) {
            setError(true);
          }
          console.error(spotifyApiResponse.message || 'Failed to retrieve ranking data from API');
          return;
        }
        
        setSpotifySongs(transformSpotifyData(spotifyApiResponse.data.items));
        setError(false); // 성공 시 에러 상태 초기화
      } catch (err) {
        console.error('Failed to fetch Spotify songs:', err);
        if (spotifySongs.length === 0) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []); // spotifySongs를 의존성 배열에서 제거

  if (loading) {
    return <p className="text-white text-center">Loading Spotify songs...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-white bg-gray-800/5 rounded-lg p-4">
        <FaExclamationTriangle className="w-8 h-8 text-yellow-400 mb-2" />
        <p className="font-semibold">Spotify 오류</p>
        <p className="text-sm text-gray-400">API 오류로 스포티파이 데이터를 가져오지 못했습니다.</p>
      </div>
    );
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
