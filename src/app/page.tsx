"use client";

import { AudioLines, MessageCircleWarning} from 'lucide-react';
import { YouTubeSlider } from '@/components/YouTubeSlider';
import { PlatformRanking } from '@/components/PlatformRanking';

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
      <section className="mx-auto max-w-5xl py-15">
        <div className="flex items-center mb-4 gap-2 font-bold text-2xl text-white">
          <AudioLines />
          <h2>Best Vocaloid MV</h2>
          <div className="group relative flex items-center -translate-y-3">
            <MessageCircleWarning size={20}/>
            <div className="absolute left-full top-1/2 z-10 ml-4 -translate-y-1/2 scale-0 transform rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
              <div className="absolute -left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white"/>
              베스트 뮤비는 현재 커뮤니티 추천 목록을 통해서 월마다 변경하고 있습니다.
            </div>
          </div>
        </div>
        <YouTubeSlider videoIds={youtubeVideoIds} />
      </section>

      {/* Monthly Top Songs Section */}
      <section className="mx-auto max-w-5xl py-10">
        <PlatformRanking />
      </section>

    </main>
  );
}