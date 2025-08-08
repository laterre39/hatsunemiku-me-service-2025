"use client";

import { AudioLines } from 'lucide-react';
import { YouTubeSlider } from '@/components/YouTubeSlider';
import { YouTubeRanking } from '@/components/YouTubeRanking';
import { SpotifyRanking } from '@/components/SpotifyRanking';
import { Tooltip } from '@/components/Tooltip';
import { MikuIntroduction } from '@/components/MikuIntroduction';

// 배열을 무작위로 섞는 헬퍼 함수 (Fisher-Yates shuffle)
const shuffleArray = <T extends unknown[]>(array: T): T => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

export default function Home() {
  const youtubeVideoIds = [
    '3iUgKH8c7p4', // いますぐ輪廻 （Retry Now） / 하츠네 미쿠
    'BI9Ue6JwJic', // DECO*27 - チェリーポップ feat. 初音ミク
    'vg6pnvn1u10', // 장난기 기능(おちゃめ機能) / 카사네 테토
    'xdNIO7WudEw', // TAK - ‘고독사이코 (Psycho Mode)
    'wpEtAg_ngOU', // 순하추등 / 세카이
    'Bi0FB2sBCjQ', // 【猫使ビィ＆初音ミク】グリッチギツネ【オリジナル曲】
    'Ig-a4aJR3jM', // 8.32 (Acoustic Ver.) / *Luna feat.Hatsune Miku
    '6Fm-wW_57FY', // MV「死別」 / Shannon feat. GUMI
    'JW3N-HvU0MA', // 미키토P 『소녀 레이』 MV
    'TA5OFS_xX0c', // 샤를 / flower
  ];

  // 셔플된 배열을 YouTubeSlider에 전달
  const shuffledVideoIds = shuffleArray([...youtubeVideoIds]);

  // 미쿠 탄생일로부터 경과 일수 계산
  const mikuBirthday = new Date('2007-08-31');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - mikuBirthday.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <main className="bg-miku-light-gray/30">

      {/* Miku Introduction Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>About Hatsune Miku</h2>
          <Tooltip text="지금 바로 윤회! 이번에도 맺어지지 않네 🩵 거짓말하면 바늘 천 개, 맹세해 🩷 다음 생에서는 꼭 다시 만나자?"/>
        </div>    
        <MikuIntroduction diffDays={diffDays} />
      </section>

      {/* Vocaloid MV Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">      
          <AudioLines />
          <h2>Best Vocaloid MV</h2>
          <Tooltip text="커뮤니티 유저들의 추천을 통해서 보컬로이드 뮤비를 선정하고 있습니다."/>
        </div>
        <YouTubeSlider videoIds={shuffledVideoIds} />
      </section>

      {/* Youtube Vocaloid Ranking Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Youtube Ranking</h2>
          <Tooltip text="키워드 검색을 통해서 조회수를 기준으로 유튜브 랭킹을 집계하고 있습니다."/>
        </div>
        <YouTubeRanking />
      </section>

      {/* Spotify Vocaloid Ranking Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Spotify Ranking</h2>
          <Tooltip text="아티스트 마다 상위 인기도를 기준으로 합산해서 합산된 음반의 인기도를 기준으로 스포티파이 랭킹을 집계하고 있습니다."/>
        </div>
        <SpotifyRanking />
      </section>

    </main>
  );
}