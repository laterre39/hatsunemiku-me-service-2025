"use client";

import { useState, useEffect } from 'react';
import { SongList } from '@/components/SongList';
import { Song } from '@/types/song';
import { FaExclamationTriangle } from 'react-icons/fa';

interface VocaDbPv {
    service: string;
    url: string;
    thumbUrl: string;
    author: string;
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
}

const getYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const transformVocaDbData = (items: VocaDbSong[], limit: number): Song[] => {
    return items.slice(0, limit).map((item, index) => {
        const producer = item.artists?.find(artist => artist.categories === 'Producer');
        const artistName = producer ? producer.name : item.artistString;

        let targetPv: VocaDbPv | undefined;
        const youtubePvs = item.pvs?.filter(pv => pv.service === 'Youtube') || [];
        
        targetPv = youtubePvs.find(pv => pv.author && !pv.author.includes('Topic'));

        if (!targetPv && youtubePvs.length > 0) {
            targetPv = youtubePvs[0];
        }

        if (!targetPv) {
            targetPv = item.pvs?.find(pv => pv.service === 'NicoNicoDouga');
        }

        const youtubeId = (targetPv?.service === 'Youtube' && targetPv.url) ? getYouTubeId(targetPv.url) : null;

        const thumbnailUrl = youtubeId
            ? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`
            : targetPv?.thumbUrl || '';

        return {
            rank: index + 1,
            title: item.name,
            artist: artistName,
            thumbnailUrl: thumbnailUrl,
            platformId: youtubeId || '',
            duration: 'N/A',
            pvs: [],
        };
    });
};

export function VocaDbRanking({ limit = 10 }: { limit?: number }) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch('/api/vocadb-ranking');
                if (!res.ok) {
                    throw new Error(`API call failed: ${res.statusText}`);
                }
                const data = await res.json();
                setSongs(transformVocaDbData(data.items, limit));
            } catch (err) {
                console.error('Failed to fetch VocaDB songs:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [limit]);

    if (loading) {
        return <p className="text-white text-center">Loading VocaDB ranking...</p>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[240px] text-white bg-gray-800/5 rounded-lg p-4">
                <FaExclamationTriangle className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="font-semibold">VocaDB 오류</p>
                <p className="text-sm text-gray-400">API 오류로 VocaDB 데이터를 가져오지 못했습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {songs.map((song) => (
                <SongList key={song.rank} song={song}/>
            ))}
        </div>
    );
}
