'use client';

import { useEffect, useState } from 'react';
import { ImageOff, MessageSquareQuote, ArrowDownCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- 스켈레톤 UI ---
const PlaylistCardFeaturedSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm flex flex-col h-full animate-pulse">
    <div className="p-5 pb-2 flex-grow">
      <div className="mb-4">
        <div className="h-6 w-3/4 bg-neutral-700/50 rounded-md mb-2"></div>
        <div className="h-4 w-1/2 bg-neutral-700/50 rounded-md"></div>
      </div>
      <div className="relative aspect-video w-full mb-4 rounded-xl bg-neutral-700/50"></div>
      <div className="w-full h-16 bg-neutral-700/50 rounded-xl mb-2"></div>
    </div>
    <div className="p-4 pt-0 mt-auto">
      <div className="w-full h-12 bg-neutral-700/50 rounded-xl"></div>
    </div>
  </div>
);

interface VideoItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

interface PlaylistCardFeaturedProps {
  playlistId: string;
  platform: 'youtube' | 'spotify';
  playlistTitle: string;
  description?: string;
  creator?: string;
  featuredTrackIndices?: number[];
  onMoveToPlaylist: (playlistId: string, platform: string) => void;
}

export default function PlaylistCardFeatured({ playlistId, platform, playlistTitle, description, creator, featuredTrackIndices, onMoveToPlaylist }: PlaylistCardFeaturedProps) {
  const [playlistData, setPlaylistData] = useState<{ items: VideoItem[], totalResults: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const response = await fetch(`/api/playlist?platform=${platform}&playlistId=${playlistId}`);
        if (!response.ok) throw new Error('Failed to fetch playlist');
        const data = await response.json();
        setPlaylistData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [platform, playlistId]);

  if (loading) {
    return <PlaylistCardFeaturedSkeleton />;
  }

  if (!playlistData) return null;

  const featuredTracks = featuredTrackIndices && featuredTrackIndices.length > 0
    ? featuredTrackIndices.map(index => playlistData.items[index]).filter(Boolean)
    : playlistData.items.slice(0, 5);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm flex flex-col h-full group hover:bg-white/10 hover:border-white/20 transition-colors duration-300">
      <div className="p-5 pb-2 flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold text-white leading-tight truncate pr-2" title={playlistTitle}>{playlistTitle}</h2>
          </div>
          {creator && <p className="text-xs text-neutral-500">Curated by <span className="text-neutral-400 font-medium">{creator}</span></p>}
        </div>

        <div className="relative aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg custom-swiper">
          <Swiper
            modules={[EffectFade, Autoplay, Pagination, Navigation]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 4000, disableOnInteraction: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            loop={true}
            className="w-full h-full"
          >
            {featuredTracks.map((item) => (
              <SwiperSlide key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><ImageOff className="w-12 h-12 text-neutral-700" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-sm line-clamp-1 drop-shadow-md">{item.title}</h3>
                    <p className="text-[10px] text-neutral-300 drop-shadow-sm">{item.artist}</p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {description && (
          <div className="flex gap-3 p-3 bg-neutral-800/30 rounded-xl border border-neutral-700/30 mb-2">
            <div className="flex-shrink-0 mt-0.5"><MessageSquareQuote className="w-4 h-4 text-teal-400" /></div>
            <p className="text-neutral-300 text-xs leading-relaxed line-clamp-3">{description}</p>
          </div>
        )}
      </div>

      <div className="p-4 pt-0 mt-auto">
        <button 
          onClick={() => onMoveToPlaylist(playlistId, platform)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40 hover:-translate-y-0.5"
        >
          <ArrowDownCircle size={16} />
          <span>플레이리스트 보기</span>
        </button>
      </div>
    </div>
  );
}
