"use client";

import React, {useCallback, useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import {ChevronsLeft, ChevronsRight} from 'lucide-react';
import YouTube from 'react-youtube';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface YouTubeSliderProps {
  videoIds: string[];
}

export function YouTubeSlider({ videoIds }: Readonly<YouTubeSliderProps>) {
  const playerRefs = useRef<Map<string, YT.Player>>(new Map());

  const opts = {
    playerVars: {
      autoplay: 0,
      controls: 0, // 비디오 컨트롤 숨기기
      showinfo: 0, // 비디오 제목 및 업로더 정보 숨기기
      modestbranding: 1, // YouTube 로고 숨기기
      rel: 0, // 관련 동영상 표시 방지
      iv_load_policy: 3, // 비디오 주석 숨기기
      origin: 'https://hatsunemiku.me', // 출처 설정
    },
  };

  const onPlayerReady = useCallback((event: { target: YT.Player }, videoId: string) => {
    playerRefs.current.set(videoId, event.target);
  }, []);

  const onSlideChange = useCallback((swiper: { realIndex: number; }) => {
    const currentVideoId = videoIds[swiper.realIndex];
    playerRefs.current.forEach((player, id) => {
      if (id !== currentVideoId) {
        player.stopVideo(); // pauseVideo() 대신 stopVideo() 사용
      }
    });
  }, [videoIds]);

  return (
    <div className="w-full max-w-5xl relative select-none" draggable={false}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="mySwiper"
        onSlideChange={onSlideChange}
      >
        {videoIds.map((videoId) => (
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
