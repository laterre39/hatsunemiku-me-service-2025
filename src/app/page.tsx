import { YouTubeSlider } from '@/components/YouTubeSlider';
import { AudioLines } from 'lucide-react';

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

      {/* Video Section */}
      <section className="mx-auto max-w-5xl pt-20">
        <div className="flex justify-start items-center gap-2 text-2xl text-white">
          <AudioLines />
          <span>Best Vocaloid MV</span>
        </div>
        <YouTubeSlider videoIds={youtubeVideoIds} />
      </section>
    
    </main>
  );
}
