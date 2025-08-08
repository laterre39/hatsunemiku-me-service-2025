import Image from 'next/image';

interface MikuIntroductionProps {
  diffDays: number;
}

export function MikuIntroduction({ diffDays }: MikuIntroductionProps) {
  return (
    <div className="max-w-5xl flex flex-col md:flex-row md:items-center gap-8">
      <div className="md:w-1/4 mb-4 md:mb-0 flex max-md:justify-center">
      <Image
        src="/cherrypop.png"
        alt="체리팝 일러스트"
        width={300}
        height={300}
        className="object-contain rounded-lg w-full h-auto max-w-xs"
      />
      </div>
      <div className="md:w-3/4 text-left">
        <h3 className="text-xl md:text-2xl text-white text-miku-turquoise mb-4">
          <span className="text-[#39C5BB] underline underline-offset-4 decoration-4 decoration-[#39C5BB]">하츠네 미쿠</span>와 함께한지 <span className="text-[#FF7BAC] underline underline-offset-4 decoration-4 decoration-[#FF7BAC]">{diffDays}</span>일째!
        </h3>
        <p className="text-base md:text-lg text-white leading-relaxed overflow-hidden">
          <strong>하츠네 미쿠</strong>는 <strong>크립톤 퓨처 미디어</strong>가 개발한 <strong>음성 합성 소프트웨어</strong>이자, 이를 기반으로 한 <strong>캐릭터</strong>입니다. <strong>2007년 8월 31일</strong>에 탄생하여 전 세계적으로 수많은 팬들에게 사랑받고 있으며, 다양한 <strong>음악</strong>, <strong>일러스트</strong>, <strong>게임</strong> 등 여러 분야에서 활발하게 활동하고 있습니다. 미쿠의 목소리는 수많은 <strong>창작자</strong>들에게 영감을 주며, 그녀의 존재는 <strong>음악과 기술의 경계</strong>를 허물고 <strong>새로운 문화 현상</strong>을 만들어냈습니다.
        </p>
        <p className="text-white leading-relaxed mt-2 text-right"><a href="https://gall.dcinside.com/mikuhatsune/381515" target="_blank" rel="noopener noreferrer" className="hover:underline decoration-amber-300">Art by 자택관리인</a></p>
      </div>
    </div>
  );
}
