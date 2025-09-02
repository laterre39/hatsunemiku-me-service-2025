"use client";

import {useEffect, useRef, useState} from 'react';
import {FaSpotify, FaYoutube} from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft, ArrowRight, Clock, Eye, Headphones, Music4} from 'lucide-react';

// --- Types ---
interface YouTubeItem {
    id: { videoId: string };
    snippet: {
        title: string;
        channelTitle: string;
        thumbnails: { high: { url: string } };
    };
    statistics: { viewCount: string };
    durationInSeconds?: number;
}

interface SpotifyItem {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string, images: { url: string }[] };
    external_urls: { spotify: string };
    popularity?: number;
    duration_ms?: number;
}

const ITEMS_PER_PAGE = 10;

// --- Helper Functions ---
const decodeHtmlEntities = (text: string): string => {
    if (typeof window === 'undefined') {
        return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
};

const formatViewCount = (count: string) => {
    const num = parseInt(count, 10);
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`;
    return num.toLocaleString();
};

const formatYouTubeDuration = (totalSeconds: number | undefined) => {
    if (totalSeconds === undefined) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatSpotifyDuration = (ms: number | undefined) => {
    if (ms === undefined) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

// A new normalized type for display
interface DisplayItem {
    id: string;
    href: string;
    imageUrl: string;
    title: string;
    artist: string;
    albumName?: string;
    duration: string;
    views?: string;
    popularity?: number;
}

// --- Reusable Ranking List Component (Updated Design) ---
const RankingList = ({items, page}: { items: DisplayItem[]; page: number }) => {
    if (!items || items.length === 0) {
        return <p className="text-center text-gray-400">랭킹 정보를 불러오지 못했습니다.</p>;
    }

    return (
        <ul className="space-y-4">
            {items.map((item, index) => {
                const rank = (page - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                    <li key={item.id}>
                        <Link href={item.href} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-4 rounded-2xl bg-white/[.03] p-3 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:border-white/20 hover:-translate-y-1">

                            {/* Rank */}
                            <div className="w-12 text-center text-2xl font-bold text-gray-400 flex-shrink-0">{rank}</div>

                            {/* Image */}
                            <div className="relative w-16 h-16 md:w-28 md:h-16 flex-shrink-0 overflow-hidden rounded-lg group">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 64px, 112px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div
                                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Music4 className="text-white" size={32}/>
                                </div>
                            </div>

                            {/* Main content wrapper */}
                            <div className="flex-grow flex flex-col md:flex-row md:justify-between md:items-end min-w-0">
                                {/* Left side: Info */}
                                <div className="flex flex-col min-w-0 md:pr-4">
                                    <p className="truncate font-medium text-white text-base md:text-lg">
                                        {item.title}
                                    </p>
                                    <p className="truncate text-sm text-gray-300 mt-1">
                                        {item.artist}
                                    </p>
                                    {item.albumName && (
                                        <p className="truncate text-xs text-gray-400 mt-1 hidden md:block">
                                            {item.albumName}
                                        </p>
                                    )}
                                </div>

                                {/* Right side: Stats (as a row) */}
                                <div className="flex-shrink-0 flex items-center gap-3 text-xs text-gray-300 mt-2 md:mt-0">
                                    <div className="flex items-center font-bold gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                                        <Clock size={14}/>
                                        <span>{item.duration}</span>
                                    </div>
                                    {item.views && (
                                        <div className="flex items-center font-bold gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                                            <Eye size={14}/>
                                            <span>{item.views}</span>
                                        </div>
                                    )}
                                    {item.popularity !== undefined && (
                                        <div className="flex items-center font-bold gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                                            <Headphones size={14}/>
                                            <span>{item.popularity}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};


// --- Main Music Page Component ---
export default function MusicPage() {
    const [platform, setPlatform] = useState<'youtube' | 'spotify'>('youtube');
    const [rankings, setRankings] = useState<{ youtube: YouTubeItem[]; spotify: SpotifyItem[] }>({
        youtube: [],
        spotify: []
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const mainRef = useRef<HTMLElement>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [youtubeRes, spotifyRes] = await Promise.all([
                    fetch('/api/youtube-ranking'),
                    fetch('/api/spotify-ranking'),
                ]);
                const youtubeData = await youtubeRes.json();
                const spotifyData = await spotifyRes.json();
                setRankings({youtube: youtubeData.items || [], spotify: spotifyData.data?.items || []});
            } catch (error) {
                console.error("Failed to fetch rankings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (mainRef.current) {
            mainRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [currentPage, platform]);

    const handlePlatformChange = (p: 'youtube' | 'spotify') => {
        setPlatform(p);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil((platform === 'youtube' ? rankings.youtube.length : rankings.spotify.length) / ITEMS_PER_PAGE);

    let displayedItems: DisplayItem[];
    if (platform === 'youtube') {
        const paginatedYouTubeItems = rankings.youtube.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        displayedItems = paginatedYouTubeItems.map(item => ({
            id: item.id.videoId,
            href: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            imageUrl: item.snippet.thumbnails.high.url,
            title: decodeHtmlEntities(item.snippet.title),
            artist: item.snippet.channelTitle,
            duration: formatYouTubeDuration(item.durationInSeconds),
            views: formatViewCount(item.statistics.viewCount),
        }));
    } else {
        const paginatedSpotifyItems = rankings.spotify.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        displayedItems = paginatedSpotifyItems.map(item => ({
            id: item.id,
            href: item.external_urls.spotify,
            imageUrl: item.album.images[0].url,
            title: decodeHtmlEntities(item.name),
            artist: item.artists.map(a => a.name).join(', '),
            albumName: item.album.name,
            duration: formatSpotifyDuration(item.duration_ms),
            popularity: item.popularity,
        }));
    }

    return (
        <main ref={mainRef} className="mx-auto max-w-4xl py-12 px-4 scroll-mt-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 음악 랭킹</h1>
                <p className="text-lg text-gray-300">각 플랫폼의 인기 보컬로이드 음악 랭킹을 제공하고 있습니다.</p>
            </div>

            {/* Platform Tabs */}
            <div className="mb-8 flex justify-center">
                <div className="relative flex w-full max-w-xs items-center rounded-full bg-black/25">
                    <div
                        className={`absolute h-full w-1/2 rounded-full transition-transform duration-300 ease-in-out
              ${platform === 'youtube' ? 'translate-x-0 bg-red-500' : 'translate-x-full bg-green-500'}`}
                    />
                    <button
                        onClick={() => handlePlatformChange('youtube')}
                        className="relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-center font-semibold transition-colors"
                    >
                        <FaYoutube size={22} className={platform === 'youtube' ? 'text-white' : 'text-red-500'}/>
                        <span className={platform === 'youtube' ? 'text-white' : 'text-gray-300'}>YouTube</span>
                    </button>
                    <button
                        onClick={() => handlePlatformChange('spotify')}
                        className="relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-center font-semibold transition-colors"
                    >
                        <FaSpotify size={22} className={platform === 'spotify' ? 'text-white' : 'text-green-500'}/>
                        <span className={platform === 'spotify' ? 'text-white' : 'text-gray-300'}>Spotify</span>
                    </button>
                </div>
            </div>

            {/* Rankings Display */}
            <div>
                {loading ? (
                    <p className="text-center text-white">랭킹을 불러오는 중입니다...</p>
                ) : (
                    <RankingList items={displayedItems} page={currentPage}/>
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowLeft size={16}/>
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors ${
                                    currentPage === page
                                        ? 'bg-white text-gray-900'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowRight size={16}/>
                    </button>
                </div>
            )}
        </main>
    );
}
