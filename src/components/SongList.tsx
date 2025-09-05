import Image from 'next/image';
import { Clock } from 'lucide-react';

interface Song {
  rank: number;
  title: string;
  artist: string;
  album?: string; // album 필드를 옵셔널로 변경
  duration: string;
  thumbnailUrl: string;
  platformId: string; // YouTube video ID or Spotify track ID
}

interface SongListProps {
  song: Song; // 단일 Song 객체를 받도록 변경
  platformType: 'youtube' | 'spotify'; // Add platformType prop
}

export function SongList({ song, platformType }: SongListProps) {
  const handleCardClick = (platformId: string) => {
    let url = '';
    if (platformType === 'youtube') {
      url = `https://www.youtube.com/watch?v=${platformId}`;
    } else if (platformType === 'spotify') {
      url = `https://open.spotify.com/track/${platformId}`;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      key={song.rank}
      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-md cursor-pointer w-full"
      onClick={() => handleCardClick(song.platformId)}
    >
      <span className="w-8 text-center text-xl font-bold text-white/30">{song.rank}</span>
      <Image
        src={song.thumbnailUrl}
        alt={song.title}
        width={64}
        height={64}
        unoptimized={true}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate text-base">{song.title}</p>
        <p className="text-sm text-white/60 truncate">{song.artist}</p>
        {song.album && <p className="text-xs text-white/40 truncate italic">{song.album}</p>}
      </div>
      <div className="flex items-center gap-1 text-xs text-white/40 font-mono px-2">
        <Clock size={14} />
        <span>{song.duration}</span>
      </div>
    </div>
  );
}
