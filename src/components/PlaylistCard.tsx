'use client';

import { useEffect, useState } from 'react';
import { Music, ListMusic, ImageOff, Star, MessageSquareQuote, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { FaYoutube, FaSpotify } from 'react-icons/fa';
import Image from 'next/image'; // Image 컴포넌트 import

interface VideoItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

interface PlaylistCardProps {
  playlistId: string;
  platform: 'youtube' | 'spotify';
  playlistTitle: string;
  description?: string;
  creator?: string;
  featuredTrackIndices?: number[];
}

export default function PlaylistCard({ playlistId, platform, playlistTitle, description, creator, featuredTrackIndices }: PlaylistCardProps) {
  const [playlistData, setPlaylistData] = useState<{ items: VideoItem[], totalResults: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const response = await fetch(`/api/playlist?platform=${platform}&playlistId=${playlistId}`);
        if (!response.ok) throw new Error('Failed to fetch playlist');
        const data = await response.json();
        setPlaylistData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [platform, playlistId]);

  if (loading) {
    return <div className="bg-gray-800/50 rounded-2xl animate-pulse h-96" />;
  }

  if (error || !playlistData) {
    return <div className="bg-red-900/50 text-white p-4 rounded-lg">Error: {error || 'Playlist not found'}</div>;
  }

  const featuredTracks = featuredTrackIndices && featuredTrackIndices.length > 0
    ? featuredTrackIndices.map(index => playlistData.items[index]).filter(Boolean)
    : playlistData.items.slice(0, 5);

  const allTracks = playlistData.items;

  const PlatformIcon = platform === 'youtube' ? FaYoutube : FaSpotify;
  const platformName = platform === 'youtube' ? 'YouTube' : 'Spotify';
  const iconColor = platform === 'youtube' ? 'text-red-500' : 'text-green-500';
  
  const playlistUrl = platform === 'youtube' 
    ? `https://www.youtube.com/playlist?list=${playlistId}`
    : `https://open.spotify.com/playlist/${playlistId}`;

  return (
    <div 
      id={`playlist-${platform}-${playlistId}`} 
      className="bg-neutral-900/70 border border-neutral-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm flex flex-col transition-all duration-300 scroll-mt-24 hover:border-teal-500/30"
    >
      <div className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white pr-4">{playlistTitle}</h2>
          
          <div className="flex items-center gap-2 flex-wrap">
            <a 
              href={playlistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-neutral-800/50 text-neutral-400 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white transition-all duration-200 group"
              title={`Open in ${platformName}`}
            >
              <PlatformIcon className={`text-sm ${iconColor}`} />
              <span>{platformName}</span>
              <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex-shrink-0 bg-neutral-800/50 text-neutral-400 text-xs font-medium px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border border-neutral-700/50">
              <Music size={12} />
              <span>{playlistData.totalResults}곡</span>
            </div>
          </div>
        </div>
        
        {description && (
          <div className="flex gap-4 p-4 bg-gradient-to-r from-neutral-800/50 to-neutral-800/30 rounded-xl border border-neutral-700/50">
            <div className="flex-shrink-0"><div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center"><MessageSquareQuote className="w-5 h-5 text-teal-400" /></div></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-2"><h4 className="text-xs font-bold text-teal-500 uppercase tracking-wider">Curator&#39;s Note</h4>{creator && (<span className="text-xs text-neutral-500">by <span className="font-semibold text-neutral-400">{creator}</span></span>)}</div>
              <p className="text-neutral-300 text-sm leading-relaxed mt-1">{description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 mb-3 mt-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
          <h3 className="text-lg font-semibold text-white">Curator&#39;s Pick</h3>
        </div>
        <p className="text-sm text-neutral-400 ml-7">큐레이터가 엄선한 트랙</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6 mb-6">
        {featuredTracks.map((item, index) => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`group relative rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 shadow-lg ${index === 4 ? 'hidden md:block' : ''}`}
          >
            <div className="relative w-full aspect-video">
              {item.thumbnail ? (
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50"><ImageOff className="h-10 w-10 text-slate-500" /></div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="font-semibold text-sm text-white truncate" title={item.title}>{item.title}</h3>
                <p className="text-xs text-gray-300 truncate" title={item.artist}>{item.artist}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="px-6 pb-6">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all duration-200 border border-neutral-700/50 group">
          <ListMusic className={`w-5 h-5 transition-colors ${isExpanded ? 'text-teal-400' : 'text-neutral-400 group-hover:text-teal-400'}`} />
          <span className="font-medium text-sm">{isExpanded ? '트랙 리스트 숨기기' : '모든 트랙 보기'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500 group-hover:text-white" /> : <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-white" />}
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 min-h-0 border-t border-neutral-800/50 pt-4">
          <div className="max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-800/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 transition-colors">
            <ul className="space-y-1 pb-4">
              {allTracks.map((item, index) => (
                <li key={item.id} className="flex items-center p-2 rounded-lg hover:bg-neutral-800/60 transition-colors duration-200 group border border-transparent hover:border-neutral-700/50">
                  <span className="text-neutral-500 w-8 text-center text-sm font-bold mr-2 group-hover:text-teal-400 transition-colors">{index + 1}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-grow min-w-0">
                    <p className="text-sm text-neutral-200 truncate group-hover:text-white transition-colors">{item.title}</p>
                    <p className="text-xs text-neutral-500 truncate group-hover:text-neutral-400 transition-colors">{item.artist}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
