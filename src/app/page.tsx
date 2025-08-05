"use client";

import { YouTubeSlider } from '@/components/YouTubeSlider';
import { AudioLines, MessageCircleWarning } from 'lucide-react';
import { InfoModal } from '@/components/InfoModal';

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
      <section className="mx-auto max-w-5xl pt-30">
        <div className="flex justify-start items-center mb-3 gap-2 text-2xl text-white">
          <AudioLines />
          <span>Best Vocaloid MV</span>
          <InfoModal
            title="Best Vocaloid MV 안내"
            content="커뮤니티에서 조사를 통해 선정한 보컬로이드 베스트 뮤비 리스트입니다. update-25.08"
            tooltipText="보컬로이드 베스트 뮤비 선정 안내!"
            className="-translate-y-3"
          >
            <MessageCircleWarning size={20}/>
          </InfoModal>
        </div>
        <YouTubeSlider videoIds={youtubeVideoIds} />
      </section>
    
    </main>
  );
}
