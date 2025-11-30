"use client";

import Image from 'next/image';
import { Song } from '@/types/song';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface SongListProps {
    song: Song;
    platformType: 'youtube' | 'spotify';
}

const FallbackThumbnail = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 border-b border-white/10">
        <ImageOff className="h-10 w-10 text-slate-500" />
    </div>
);

export function SongList({ song, platformType }: SongListProps) {
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

    return (
        <div className="group relative rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
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
                            unoptimized={imageUrl.includes('nicovideo')}
                        />
                    ) : (
                        <FallbackThumbnail />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute top-2 right-2 flex items-center gap-2 text-white">
                        <span className="font-bold text-xl md:text-2xl drop-shadow-lg">#{song.rank}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/80 to-transparent">
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
