"use client";

import {AudioLines} from 'lucide-react';
import {YouTubeSlider} from '@/components/YouTubeSlider';
import {Tooltip} from '@/components/Tooltip';
import {MikuIntroduction} from '@/components/MikuIntroduction';
import {EventSchedule} from "@/components/EventSchedule";
import {RankingComponent} from "@/components/RankingComponent";
import {MikuBirthdayConfetti} from "@/components/MikuBirthdayConfetti";
import {VocaloidCommunity} from "@/components/VocaloidCommunity";

export default function Home() {
  return (
      <main>

        {/* Vocaloid MV Section */}
        <section className="mx-auto max-w-5xl pb-24">
          <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
            <AudioLines/>
            <h2>Best Vocaloid MV</h2>
            <Tooltip text="커뮤니티 유저들의 추천을 통해서 보컬로이드 뮤비를 선정하고 있습니다, 랜덤으로 선정된 5개의 영상을 서비스 하고 있습니다."/>
          </div>
          <YouTubeSlider/>
        </section>

        {/* Miku Introduction Section */}
        <section className="mx-auto max-w-5xl pb-24">
          <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
            <AudioLines/>
            <h2>About Hatsune Miku</h2>
            <Tooltip text="지금 바로 윤회! 이번에도 맺어지지 않네 🩵 거짓말하면 바늘 천 개, 맹세해 🩷 다음 생에서는 꼭 다시 만나자?"/>
          </div>
          <MikuIntroduction/>
        </section>

        {/* Vocaloid Ranking Section */}
        <section className="mx-auto max-w-5xl pb-24">
          <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
            <AudioLines/>
            <h2>Vocaloid Ranking</h2>
            <Tooltip text="유튜브와 스포티파이에서 특정 알고리즘을 통해 3개월 간의 보컬로이드 랭킹을 가져와서 집계하고 있습니다."/>
          </div>
          <RankingComponent/>
        </section>

        {/* Vocaloid Event Schedule Section */}
        <section className="mx-auto max-w-5xl pb-24">
          <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
            <AudioLines/>
            <h2>Vocaloid Event Schedule</h2>
            <Tooltip text="올해의 보컬로이드 관련 이벤트 스케쥴을 안내합니다."/>
          </div>
          <EventSchedule/>
        </section>

        {/* Vocaloid Community Section */}
        <section className="mx-auto max-w-5xl pb-24">
          <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
            <AudioLines/>
            <h2>Vocaloid Community</h2>
            <Tooltip text="보컬로이드 커뮤니티를 소개합니다."/>
          </div>
          <VocaloidCommunity/>
        </section>

        {/*생일 표시용 컴포넌트*/}
        <MikuBirthdayConfetti/>

      </main>
  );
}
