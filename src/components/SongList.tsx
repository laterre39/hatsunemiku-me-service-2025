"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Song } from '@/types/song';
import Link from 'next/link';
import { Crown, ImageOff } from 'lucide-react';

interface SongListProps {
    song: Song;
}

const FallbackThumbnail = (): React.JSX.Element => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 border-b border-white/10">
        <ImageOff className="h-10 w-10 text-slate-500" />
    </div>
);

const RankBadge = ({ rank }: { rank: number }): React.JSX.Element => {
    const rankStyles: { [key: number]: { className: string; icon: React.JSX.Element } } = {
        1: {
            className: 'text-[#39C5BB]',
            icon: <Crown className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />,
        },
        2: {
            className: 'text-[#FF7BAC]',
            icon: <Crown className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />,
        },
        3: {
            className: 'text-slate-400',
            icon: <Crown className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />,
        },
    };

    const style = rankStyles[rank];

    if (rank > 3) {
        return (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 font-bold text-2xl text-white" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.7))' }}>
                <span>#{rank}</span>
            </div>
        );
    }

    return (
        <div className={`absolute top-2 right-2 flex items-center gap-1.5 font-bold text-2xl ${style.className}`} style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.7))' }}>
            {style.icon}
            <span>{rank}</span>
        </div>
    );
};

const getRankBorderStyle = (rank: number): string => {
    switch (rank) {
        case 1:
            return 'border-[#39C5BB]';
        case 2:
            return 'border-[#FF7BAC]';
        case 3:
            return 'border-slate-400';
        default:
            return 'border-white/10';
    }
};

export function SongList({ song }: SongListProps) {
    const [imageUrl, setImageUrl] = useState(song.thumbnailUrl);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageUrl(song.thumbnailUrl);
        setImageError(false);
    }, [song.thumbnailUrl]);

    const handleImageError = () => {
        if (imageUrl.includes('maxresdefault.jpg')) {
            setImageUrl(`https://i.ytimg.com/vi/${song.platformId}/hqdefault.jpg`);
        } else {
            setImageError(true);
        }
    };

    const platformLink = song.platformId
        ? `https://www.youtube.com/watch?v=${song.platformId}`
        : '#';

    const rankBorderStyle = getRankBorderStyle(song.rank);

    return (
        <div className={`group relative rounded-lg overflow-hidden bg-white/5 border-2 ${rankBorderStyle} transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1`}>
            <Link href={platformLink} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full aspect-video">
                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={song.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={handleImageError}
                            unoptimized={imageUrl.includes('nicovideo') || imageUrl.includes('ytimg')}
                        />
                    ) : (
                        <FallbackThumbnail />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <RankBadge rank={song.rank} />
                    <div className="absolute bottom-0 left-0 right-0 p-2 md-p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="font-semibold text-sm md:text-base text-white truncate" title={song.title}>
                            {song.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-300 truncate" title={song.artist}>
                            {song.artist}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
