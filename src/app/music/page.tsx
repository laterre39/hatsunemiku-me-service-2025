"use client";

import { useState, useEffect, useRef } from 'react';
import { SongCard } from '@/components/SongCard';
import { Song, Pv, WebLink } from '@/types/song';
import Pagination from '@/components/Pagination';
import { FaExclamationTriangle } from 'react-icons/fa';

interface VocaDbPv {
    id: number;
    service: string;
    url: string;
    thumbUrl: string;
    author: string;
    disabled: boolean;
    pvType: string;
}

interface VocaDbWebLink {
    description: string;
    disabled: boolean;
    url: string;
}

interface VocaDbArtistInfo {
    categories: string;
    name: string;
}

interface VocaDbSong {
    id: number;
    name: string;
    artistString: string;
    artists: VocaDbArtistInfo[];
    pvs: VocaDbPv[];
    webLinks: VocaDbWebLink[];
    lengthSeconds: number;
}

const ITEMS_PER_PAGE = 12;

const getYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const formatDuration = (totalSeconds: number): string => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const transformVocaDbData = (items: VocaDbSong[]): Song[] => {
    return items.map((item, index) => {
        const producer = item.artists?.find(artist => artist.categories === 'Producer');
        const artistName = producer ? producer.name : item.artistString;

        let targetPv: VocaDbPv | undefined;
        const enabledPvs = item.pvs.filter(pv => !pv.disabled);

        targetPv = enabledPvs.find(pv => pv.service === 'Youtube' && pv.pvType === 'Original' && !pv.author.includes('Topic'));
        if (!targetPv) {
            targetPv = enabledPvs.find(pv => pv.service === 'NicoNicoDouga' && pv.pvType === 'Original');
        }
        if (!targetPv) {
            targetPv = enabledPvs.find(pv => pv.service === 'Youtube' && !pv.author.includes('Topic'));
        }
        if (!targetPv) {
            targetPv = enabledPvs.find(pv => pv.service === 'NicoNicoDouga');
        }
        if (!targetPv && enabledPvs.length > 0) {
            targetPv = enabledPvs[0];
        }

        const youtubeId = (targetPv?.service === 'Youtube' && targetPv.url) ? getYouTubeId(targetPv.url) : null;
        const thumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg` : targetPv?.thumbUrl || '';

        const validPvs = item.pvs.filter(pv => !pv.disabled && pv.pvType === 'Original' && !pv.author.includes('- Topic'));
        const uniquePvs = Array.from(new Map(validPvs.map(pv => [pv.service, pv])).values());
        const activePvs: Pv[] = uniquePvs.map(pv => ({ id: pv.id, service: pv.service, url: pv.url }));

        const activeWebLinks: WebLink[] = (item.webLinks || [])
            .filter(link => !link.disabled && link.description === 'Spotify')
            .map(link => ({ description: link.description, url: link.url }));

        return {
            rank: index + 1,
            title: item.name,
            artist: artistName,
            thumbnailUrl: thumbnailUrl,
            platformId: (targetPv?.service === 'Youtube' && targetPv.url) ? getYouTubeId(targetPv.url) || '' : '',
            duration: formatDuration(item.lengthSeconds),
            pvs: activePvs,
            webLinks: activeWebLinks,
        };
    });
};

export default function MusicPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch('/api/vocadb-ranking');
                if (!res.ok) {
                    throw new Error(`API call failed: ${res.statusText}`);
                }
                const data = await res.json();
                setSongs(transformVocaDbData(data.items));
            } catch (err) {
                console.error('Failed to fetch VocaDB songs:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    const totalPages = Math.ceil(songs.length / ITEMS_PER_PAGE);
    const paginatedSongs = songs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <main ref={mainRef} className="mx-auto max-w-6xl py-12 px-4 scroll-mt-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 음악 랭킹</h1>
                <p className="text-lg text-gray-300">최근 발표된 보컬로이드 곡들을 대상으로, 영상 인기도를 정밀 분석하여 엄선한 인기 랭킹을 제공합니다.</p>
            </div>

            {loading ? (
                <p className="text-white text-center">랭킹을 불러오는 중입니다...</p>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[240px] text-white bg-gray-800/5 rounded-lg p-4">
                    <FaExclamationTriangle className="w-8 h-8 text-yellow-400 mb-2" />
                    <p className="font-semibold">VocaDB 오류</p>
                    <p className="text-sm text-gray-400">API 오류로 VocaDB 데이터를 가져오지 못했습니다.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                        {paginatedSongs.map((song) => (
                            <SongCard key={song.rank} song={song}/>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </main>
    );
}
