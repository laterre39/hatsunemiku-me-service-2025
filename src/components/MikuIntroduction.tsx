import Image from 'next/image';
import { differenceInDays } from 'date-fns';
import { getTodayInKST, getMikuBirthdayInJST } from '@/lib/dateUtils';

const todayInJST = getTodayInKST();
const mikuBirthdayInJST = getMikuBirthdayInJST();

const diffDays = differenceInDays(todayInJST, mikuBirthdayInJST) + 1;

export function MikuIntroduction() {
  return (
    <div className="relative w-full">
      <div className="relative bg-transparent">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          
          {/* Left: Premium Character Card */}
          <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0 p-2">
            <div className="relative w-72 h-[28rem] group perspective-1000 cursor-pointer">
                
                {/* Card Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 shadow-2xl transition-all duration-500 ease-out transform group-hover:-translate-y-3 group-hover:shadow-[0_25px_60px_-15px_rgba(57,197,187,0.3)] border border-white/10">
                    
                    <div className="absolute inset-0 z-0">
                         <Image
                            src="/gallery/cherrypop.png"
                            alt="Background Blur"
                            fill
                            className="object-cover opacity-30 blur-2xl scale-150 grayscale-[30%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>
                    </div>

                    <div className="relative w-full h-full z-10 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2">
                        <Image
                            src="/gallery/cherrypop.png"
                            alt="Hatsune Miku"
                            fill
                            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                            priority
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none mix-blend-overlay"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#39C5BB] text-gray-900 shadow-[0_0_10px_rgba(57,197,187,0.4)]">
                                    CV01
                                </span>
                                <span className="text-[#39C5BB] text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Virtual Singer
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Hatsune Miku</h3>
                            <div className="h-0.5 w-8 group-hover:w-full bg-gradient-to-r from-[#39C5BB] to-[#FF7BAC] transition-all duration-700 ease-out rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute inset-0 border border-white/5 rounded-2xl z-40 group-hover:border-[#39C5BB]/40 transition-colors duration-500"></div>
                </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full flex-1 text-center md:text-left space-y-6">
            
            {/* Header Section */}
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39C5BB] to-[#2a9d8f]">Hatsune Miku</span>
                <span className="text-white/90 text-xl ml-3 font-light tracking-wide">Debut 2007</span>
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-white/60 text-sm uppercase tracking-widest">Together for</span>
                <span className="text-4xl font-black text-[#FF7BAC] drop-shadow-sm font-mono">
                  {diffDays.toLocaleString()}
                </span>
                <span className="text-white/60 text-sm uppercase tracking-widest">days</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-white/80 text-lg leading-relaxed break-keep space-y-4">
              <p>
                <strong className="text-white font-bold">하츠네 미쿠</strong>는 2007년 8월 31일, 크립톤 퓨처 미디어가 세상에 내놓은 <span className="text-[#39C5BB] font-semibold">음성 합성 소프트웨어</span>이자 영원한 16세의 <span className="text-[#FF7BAC] font-semibold">버추얼 싱어</span>입니다.
              </p>
              <p>
                누구나 노래하게 할 수 있다는 가능성은 수많은 크리에이터들에게 영감을 주었고, 음악, 일러스트, 영상 등 장르를 불문한 <span className="text-white font-semibold">창작의 물결</span>을 일으키며 인터넷 문화의 상징이 되었습니다.
              </p>
              <p className="text-sm text-white/60 font-normal">
                지금 이 순간에도 미쿠는 전 세계의 팬들과 함께 끊임없이 새로운 노래를 부르며, 음악과 기술의 경계를 허무는 무한한 가능성의 아이콘으로 활약하고 있습니다.
              </p>
            </div>

            {/* Footer / Credits */}
            <div className="pt-4 flex justify-center md:justify-start">
               <a
                  href="https://gall.dcinside.com/mgallery/board/view?id=mikuhatsune&no=381515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#39C5BB]/50 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-5 h-5 rounded bg-[#39C5BB]/10 text-[#39C5BB] group-hover:bg-[#39C5BB] group-hover:text-gray-900 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.88 2.16 2.19 2.19 0 01-3.14 3.141 18.758 18.758 0 002.16-1.881zm-6.219-8.713a51.964 51.964 0 00-2.083 4.857 2.197 2.197 0 003.292 3.292c1.89-1.512 3.54-3.212 4.857-5.083a9.775 9.775 0 01-6.066-3.066z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] text-white/50 uppercase tracking-wide">Illustration by</span>
                    <span className="text-xs font-bold text-white/90 group-hover:text-[#39C5BB] transition-colors">자택관리인</span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-3 h-3 text-white/30 group-hover:text-[#39C5BB] group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
               </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
