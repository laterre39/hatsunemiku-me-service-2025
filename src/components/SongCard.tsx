"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Song } from '@/types/song';
import Link from 'next/link';
import { Crown, ImageOff, Clock } from 'lucide-react';
import { FaYoutube, FaSoundcloud, FaBandcamp, FaVimeo } from "react-icons/fa";
import { SiNiconico, SiBilibili } from "react-icons/si";

interface SongCardProps {
    song: Song;
}

const platformIcons: { [key: string]: React.ReactElement } = {
    Youtube: <FaYoutube />,
    NicoNicoDouga: <SiNiconico />,
    Bilibili: <SiBilibili />,
    SoundCloud: <FaSoundcloud />,
    Bandcamp: <FaBandcamp />,
    Vimeo: <FaVimeo />,
};

// 플랫폼 우선순위 (정렬용)
const platformOrder: { [key: string]: number } = {
    Youtube: 1,
    NicoNicoDouga: 2,
    Bilibili: 3,
    SoundCloud: 4,
    Bandcamp: 5,
    Vimeo: 6,
};

const FallbackThumbnail = (): React.JSX.Element => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
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
            <div className="absolute top-2 right-2 flex items-center gap-1.5 font-bold text-xl text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
                <span>#{rank}</span>
            </div>
        );
    }

    return (
        <div className={`absolute top-2 right-2 flex items-center gap-1.5 font-bold text-xl ${style.className}`} style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.7))' }}>
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
            return 'border-transparent';
    }
};

export function SongCard({ song }: SongCardProps) {
    const [imageUrl, setImageUrl] = useState(song.thumbnailUrl);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageUrl(song.thumbnailUrl);
        setImageError(false);
    }, [song.thumbnailUrl]);

    const handleImageError = () => {
        setImageError(true);
    };

    const platformLink = song.platformId
        ? `https://www.youtube.com/watch?v=${song.platformId}`
        : '#';

    const rankBorderStyle = getRankBorderStyle(song.rank);

    return (
        <div className="group flex flex-col h-full">
            <Link href={platformLink} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-transform duration-300 hover:-translate-y-1 ${rankBorderStyle}">
                {/* Image Section */}
                {!imageError ? (
                    <Image
                        src={imageUrl}
                        alt={song.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                        unoptimized={imageUrl.includes('nicovideo') || imageUrl.includes('ytimg')}
                    />
                ) : (
                    <FallbackThumbnail />
                )}
                <RankBadge rank={song.rank} />
            </Link>

            {/* Text Section */}
            <div className="pt-3 flex flex-col flex-grow">
                <h3 className="font-semibold text-base text-white truncate" title={song.title}>
                    {song.title}
                </h3>
                <p className="text-sm text-gray-300 mt-1 truncate" title={song.artist}>
                    {song.artist}
                </p>
                
                {/* Footer Section */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    {/* Platform Links */}
                    <div className="flex items-center gap-1">
                        {song.pvs
                            .filter(pv => platformIcons[pv.service])
                            .sort((a, b) => (platformOrder[a.service] || 99) - (platformOrder[b.service] || 99))
                            .map(pv => (
                                <a href={pv.url} key={pv.id} target="_blank" rel="noopener noreferrer" className="flex items-center w-8 h-8 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg">
                                    {platformIcons[pv.service]}
                                </a>
                            ))}
                    </div>
                    {/* Duration */}
                    <div className="flex items-center gap-1 text-sm text-gray-300 flex-shrink-0">
                        <Clock size={14} />
                        <span>{song.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
