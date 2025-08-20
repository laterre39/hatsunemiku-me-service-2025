"use client";

import {AudioLines} from 'lucide-react';
import {YouTubeSlider} from '@/components/YouTubeSlider';
import {YouTubeRanking} from '@/components/YouTubeRanking';
import {SpotifyRanking} from '@/components/SpotifyRanking';
import {Tooltip} from '@/components/Tooltip';
import {MikuIntroduction} from '@/components/MikuIntroduction';
import {youtubeVideoLists} from '@/data/youtubeVideoLists';
import {EventSchedule} from "@/components/EventSchedule";

// 배열을 무작위로 섞는 헬퍼 함수 (Fisher-Yates shuffle)
const shuffleArray = <T extends unknown[]>(array: T): T => {
    // 원본 배열을 수정하지 않기 위해 얕은 복사본을 만듭니다.
    const newArray = [...array] as T;
    let currentIndex = newArray.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
};

export default function Home() {
    const shuffledVideoIds = shuffleArray(youtubeVideoLists).slice(0, 10);

    // 미쿠 탄생일로부터 경과 일수 계산
    const mikuBirthday = new Date('2007-08-31');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - mikuBirthday.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <main>

            {/* Vocaloid MV Section */}
            <section className="mx-auto max-w-5xl py-12">
                <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Best Vocaloid MV</h2>
                    <Tooltip text="커뮤니티 유저들의 추천을 통해서 보컬로이드 뮤비를 선정하고 있습니다, 랜덤으로 선정된 5개의 영상을 서비스 하고 있습니다."/>
                </div>
                <YouTubeSlider videoIds={shuffledVideoIds}/>
            </section>

            {/* Miku Introduction Section */}
            <section className="mx-auto max-w-5xl py-12">
                <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>About Hatsune Miku</h2>
                    <Tooltip text="지금 바로 윤회! 이번에도 맺어지지 않네 🩵 거짓말하면 바늘 천 개, 맹세해 🩷 다음 생에서는 꼭 다시 만나자?"/>
                </div>
                <MikuIntroduction diffDays={diffDays}/>
            </section>

            {/* Youtube Vocaloid Ranking Section */}
            <section className="mx-auto max-w-5xl py-12">
                <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Youtube Ranking</h2>
                    <Tooltip text="키워드 검색을 통해서 조회수를 기준으로 유튜브 랭킹을 집계하고 있습니다."/>
                </div>
                <YouTubeRanking/>
            </section>

            {/* Spotify Vocaloid Ranking Section */}
            <section className="mx-auto max-w-5xl py-12">
                <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Spotify Ranking</h2>
                    <Tooltip text="아티스트 마다 상위 인기도를 기준으로 합산해서 합산된 음반의 인기도를 기준으로 스포티파이 랭킹을 집계하고 있습니다."/>
                </div>
                <SpotifyRanking/>
            </section>

            {/* Vocaloid Event Schedule Section */}
            <section className="mx-auto max-w-5xl py-12">
                <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Vocaloid Event Schedule</h2>
                    <Tooltip text="올해의 보컬로이드 관련 이벤트 스케쥴을 안내합니다."/>
                </div>
                <EventSchedule />
            </section>

        </main>
    );
}