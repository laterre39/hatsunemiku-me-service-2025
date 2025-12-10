"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Song } from '@/types/song';
import Link from 'next/link';
import { Crown, ImageOff, Clock } from 'lucide-react';
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { SiNiconico, SiBilibili } from "react-icons/si";

interface SongCardProps {
    song: Song;
}

const platformIcons: { [key: string]: React.ReactElement } = {
    Youtube: <FaYoutube />,
    NicoNicoDouga: <SiNiconico />,
    Bilibili: <SiBilibili />,
    Spotify: <FaSpotify />,
};

const platformOrder: { [key: string]: number } = {
    Youtube: 1,
    NicoNicoDouga: 2,
    Spotify: 3,
    Bilibili: 4,
};

const platformColors: { [key: string]: string } = {
    Youtube: 'hover:text-red-500',
    NicoNicoDouga: 'hover:text-white',
    Bilibili: 'hover:text-blue-400',
    Spotify: 'hover:text-green-500',
};

const FallbackThumbnail = (): React.JSX.Element => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
        <ImageOff className="h-10 w-10 text-slate-500" />
    </div>
);

const RankBadge = ({ rank }: { rank: number }): React.JSX.Element => {
    const rankStyles: { [key: number]: { className: string; icon: React.JSX.Element } } = {
        1: { className: 'text-[#39C5BB]', icon: <Crown className="w-5 h-5" /> },
        2: { className: 'text-[#FF7BAC]', icon: <Crown className="w-5 h-5" /> },
        3: { className: 'text-slate-400', icon: <Crown className="w-5 h-5" /> },
    };
    const style = rankStyles[rank];
    if (!style) {
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
        case 1: return 'border-[#39C5BB]';
        case 2: return 'border-[#FF7BAC]';
        case 3: return 'border-slate-400';
        default: return 'border-white/10';
    }
};

export function SongCard({ song }: SongCardProps) {
    const [imageUrl, setImageUrl] = useState(song.thumbnailUrl);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageUrl(song.thumbnailUrl);
        setImageError(false);
    }, [song.thumbnailUrl]);

    const handleImageError = () => { setImageError(true); };

    const platformLink = song.platformId ? `https://www.youtube.com/watch?v=${song.platformId}` : '#';
    const rankBorderStyle = getRankBorderStyle(song.rank);

    const allLinks = [
        ...song.pvs.map(pv => ({ id: pv.id, service: pv.service, url: pv.url })),
        ...song.webLinks.map(link => ({ id: link.url, service: link.description, url: link.url }))
    ];

    return (
        <div className="group flex flex-col h-full">
            {/* Image Section (Link) */}
            <Link href={platformLink} target="_blank" rel="noopener noreferrer" className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 ${rankBorderStyle} transition-all duration-300 hover:-translate-y-1`}>
                {!imageError ? (
                    <Image src={imageUrl} alt={song.title} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" onError={handleImageError} unoptimized={imageUrl.includes('nicovideo') || imageUrl.includes('ytimg')} />
                ) : ( <FallbackThumbnail /> )}
                <RankBadge rank={song.rank} />
            </Link>

            {/* Text Section (No Link) */}
            <div className="pt-3 flex flex-col flex-grow">
                <h3 className="font-semibold text-base text-white truncate" title={song.title}>{song.title}</h3>
                <p className="text-sm text-gray-300 mt-1 truncate" title={song.artist}>{song.artist}</p>
                
                {/* Footer Section */}
                <div className="flex items-center justify-between mt-auto pt-3">
                    {/* Platform Icons */}
                    <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                        {allLinks
                            .filter(link => platformIcons[link.service])
                            .sort((a, b) => (platformOrder[a.service] || 99) - (platformOrder[b.service] || 99))
                            .map(link => (
                                <a href={link.url} key={link.id} target="_blank" rel="noopener noreferrer" 
                                   className={`flex items-center justify-center w-6 h-6 text-gray-300 ${platformColors[link.service] || 'hover:text-white'} transition-all duration-200 text-base`}
                                   title={`${link.service}(으)로 이동`}>
                                    {platformIcons[link.service]}
                                </a>
                            ))}
                    </div>
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/15 px-2 py-1 rounded-full">
                        <Clock size={14} />
                        <span>{song.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
