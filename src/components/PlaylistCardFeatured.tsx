'use client';

import { useEffect, useState } from 'react';
import { ImageOff, ArrowDownCircle } from 'lucide-react';
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
    <div className="w-full aspect-video bg-neutral-700/50"></div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="h-7 w-3/4 bg-neutral-700/50 rounded-md mb-3"></div>
      <div className="h-4 w-1/3 bg-neutral-700/50 rounded-md mb-6"></div>
      <div className="w-full h-16 bg-neutral-700/50 rounded-xl mb-6"></div>
      <div className="w-full h-12 bg-neutral-700/50 rounded-xl mt-auto"></div>
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
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm flex flex-col h-full group hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      {/* 1. 이미지 슬라이더 영역 */}
      <div className="relative aspect-video w-full bg-neutral-900 custom-swiper">
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
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group/slide">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover/slide:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><ImageOff className="w-12 h-12 text-neutral-700" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-sm line-clamp-1 drop-shadow-md text-white/90">{item.title}</h3>
                    <p className="text-[11px] text-neutral-300 drop-shadow-sm">{item.artist}</p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white leading-tight line-clamp-1 mb-2 group-hover:text-teal-400 transition-colors" title={playlistTitle}>
            {playlistTitle}
          </h2>
          {creator && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              <p>Curated by <span className="text-neutral-300 font-medium">{creator}</span></p>
            </div>
          )}
        </div>
        
        {description && (
          <div className="relative pl-3 mb-6 border-l-2 border-teal-500/50">
            <p className="text-neutral-300 text-sm leading-relaxed line-clamp-3 italic">
              {description}
            </p>
          </div>
        )}

        <div className="mt-auto pt-2">
          <button 
            onClick={() => onMoveToPlaylist(playlistId, platform)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 hover:bg-teal-600 border border-white/10 hover:border-teal-500 text-white font-semibold text-sm transition-all duration-300 group/btn shadow-lg"
          >
            <ArrowDownCircle size={18} className="text-teal-400 group-hover/btn:text-white transition-colors" />
            <span>플레이리스트 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
