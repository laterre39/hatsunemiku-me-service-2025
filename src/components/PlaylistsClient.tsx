'use client';

import { useState, useEffect } from 'react';
import PlaylistCard from '@/components/PlaylistCard';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import { Sparkles, ListMusic } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { PlaylistInfo } from '@/data/vocaloidPlaylists';

const ITEMS_PER_PAGE = 5;

interface PlaylistsClientProps {
  playlists: PlaylistInfo[];
}

export default function PlaylistsClient({ playlists }: PlaylistsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPlaylistId, setTargetPlaylistId] = useState<string | null>(null);

  // isSlider가 true인 플레이리스트 중 3개만 선택
  const sliderPlaylists = playlists.filter(p => p.isSlider).slice(0, 3);
  
  // 페이지네이션을 적용할 전체 플레이리스트
  const totalPages = Math.ceil(playlists.length / ITEMS_PER_PAGE);
  const paginatedPlaylists = playlists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('bocalo-ply-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMoveToPlaylist = (playlistId: string, platform: string) => {
    const index = playlists.findIndex(p => p.id === playlistId && p.platform === platform);
    if (index !== -1) {
      const targetPage = Math.floor(index / ITEMS_PER_PAGE) + 1;
      setCurrentPage(targetPage);
      setTargetPlaylistId(`playlist-${platform}-${playlistId}`);
    }
  };

  // 페이지 변경 후 타겟 플레이리스트로 스크롤 이동
  useEffect(() => {
    if (targetPlaylistId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetPlaylistId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('animate-pulse-once');
          setTimeout(() => element.classList.remove('animate-pulse-once'), 2000);
          setTargetPlaylistId(null);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage, targetPlaylistId]);

  return (
    <>
      {/* 슬라이더 섹션 */}
      {sliderPlaylists.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">
              추천 플리
            </h1>
          </div>
          <FeaturedPlaylists 
            playlists={sliderPlaylists} 
            onMoveToPlaylist={handleMoveToPlaylist} 
          />
        </>
      )}

      {/* 전체 플레이리스트 섹션 */}
      <div id="bocalo-ply-section" className="border-t border-neutral-800 pt-12 mt-16 scroll-mt-20">
        <div className="flex items-center gap-3 mb-8 max-w-4xl mx-auto">
          <ListMusic className="w-8 h-8 text-teal-400" />
          <h1 className="text-3xl font-bold text-white">
            보카로 플리
          </h1>
        </div>
        <div className="flex flex-col gap-12 max-w-4xl mx-auto">
          {paginatedPlaylists.map((playlist) => (
            <PlaylistCard
              key={`${playlist.platform}-${playlist.id}`}
              playlistId={playlist.id}
              platform={playlist.platform}
              playlistTitle={playlist.title}
              description={playlist.description}
              creator={playlist.creator}
              featuredTrackIndices={playlist.featuredTrackIndices}
            />
          ))}
        </div>

        {/* 페이지네이션 컴포넌트 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
