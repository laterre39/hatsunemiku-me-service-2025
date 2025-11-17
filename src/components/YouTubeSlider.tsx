"use client";

import React, { useCallback, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import YouTube from 'react-youtube';
import { youtubeVideoData } from "@/data/youtubeVideoLists";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const shuffleArray = <T extends never[]>(array: string[]): T => {
    const newArray = [...array] as T;
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export function YouTubeSlider() {
    const playerRefs = useRef<Map<string, YT.Player>>(new Map());
    const autoplayProgressRef = useRef<HTMLDivElement>(null);
    const progressCircleRef = useRef<SVGSVGElement>(null);

    const shuffledVideoIds = useMemo(() => shuffleArray(youtubeVideoData.videos).slice(0, 10), []);

    const opts = {
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            origin: typeof window !== 'undefined' ? window.location.origin : 'https://hatsunemiku.me',
        },
    };

    const onPlayerReady = useCallback((event: { target: YT.Player }, videoId: string) => {
        playerRefs.current.set(videoId, event.target);
    }, []);

    const onSlideChange = useCallback((swiper: SwiperType) => {
        const currentVideoId = shuffledVideoIds[swiper.realIndex];
        playerRefs.current.forEach((player, id) => {
            if (id !== currentVideoId && player.getPlayerState && player.getPlayerState() === 1) {
                player.stopVideo();
            }
        });
    }, [shuffledVideoIds]);

    const onAutoplayTimeLeft = (s: SwiperType, time: number, progress: number) => {
        if (progressCircleRef.current) {
            progressCircleRef.current.style.setProperty('--progress', (1 - progress).toString());
        }
    };

    return (
        <div className="w-full max-w-5xl relative select-none" draggable={false}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper rounded-lg overflow-hidden"
                onSlideChange={onSlideChange}
            >
                {shuffledVideoIds.map((videoId) => (
                    <SwiperSlide key={videoId}>
                        <div className="relative flex justify-center items-center w-full aspect-video bg-black">
                            <YouTube
                                videoId={videoId}
                                opts={opts}
                                iframeClassName="absolute top-0 left-0 w-full h-full"
                                onReady={(event) => onPlayerReady(event, videoId)}
                            />
                        </div>
                    </SwiperSlide>
                ))}
                <div className="autoplay-progress" ref={autoplayProgressRef}>
                    <svg viewBox="0 0 48 48" ref={progressCircleRef}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                </div>
            </Swiper>
            
            {/* Custom Navigation Arrows */}
            <div className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition-all">
                <ChevronsLeft size={40} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition-all">
                <ChevronsRight size={40} />
            </div>
        </div>
    );
}
