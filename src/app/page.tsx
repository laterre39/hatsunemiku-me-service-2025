"use client";

import { AudioLines } from 'lucide-react';
import { YouTubeSlider } from '@/components/YouTubeSlider';
import { YouTubeRanking } from '@/components/YouTubeRanking';
import { SpotifyRanking } from '@/components/SpotifyRanking';
import { Tooltip } from '@/components/Tooltip';

export default function Home() {
  const youtubeVideoIds = [
    '3iUgKH8c7p4', // いますぐ輪廻 （Retry Now） / 하츠네 미쿠
    'BI9Ue6JwJic', // DECO*27 - チェリーポップ feat. 初音ミク
    'vg6pnvn1u10', // 장난기 기능(おちゃめ機能) / 카사네 테토
    'xdNIO7WudEw', // TAK - ‘고독사이코 (Psycho Mode)
    'aGhAWxror0Y', // Honey Moon Un Deux Trois - DATEKEN feat. Rin KAGAMINE
  ];

  return (
    <main className="bg-miku-light-gray/30">

      {/* Vocaloid MV Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-2 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Best Vocaloid MV</h2>
          <Tooltip text="커뮤니티 유저들의 추천을 통해서 보컬로이드 뮤비를 선정하고 있습니다."/>
        </div>
        <YouTubeSlider videoIds={youtubeVideoIds} />
      </section>

      {/* Youtube Vocaloid Ranking Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-2 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Youtube Ranking</h2>
          <Tooltip text="키워드 검색을 통해서 조회수를 기준으로 유튜브 랭킹을 집계하고 있습니다."/>
        </div>
        <YouTubeRanking />
      </section>

      {/* Spotify Vocaloid Ranking Section */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="flex items-center mb-2 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Spotify Ranking</h2>
          <Tooltip text="아티스트 마다 상위 인기도를 기준으로 합산해서 합산된 음반의 인기도를 기준으로 스포티파이 랭킹을 집계하고 있습니다."/>
        </div>
        <SpotifyRanking />
      </section>

    </main>
  );
}
