import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Wrench, Home, Music2, ListMusic, Sparkles, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '뉴스 서비스 점검 안내',
  description: '보컬로이드 뉴스 서비스 점검 및 시스템 최적화 작업 중입니다.',
};

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-3xl py-16 px-4">
      {/* 점검 컨테이너 카드 */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 sm:p-12 text-center backdrop-blur-md shadow-2xl shadow-black/40">
        
        {/* 상단 미쿠 시안 테마 블러 글로우 */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#39C5BB]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* 배지 */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#39C5BB]/30 bg-[#39C5BB]/10 px-4 py-1.5 text-xs font-semibold text-[#39C5BB] mb-8">
          <Wrench size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
          <span>SYSTEM MAINTENANCE</span>
        </div>

        {/* 중앙 아이콘 영역 */}
        <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner">
          <Newspaper className="h-12 w-12 text-[#39C5BB]" />
          <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Sparkles size={14} />
          </div>
        </div>

        {/* 헤딩 및 본문 */}
        <h1 className="relative z-10 text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          뉴스 서비스 점검 안내
        </h1>
        <p className="relative z-10 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto mb-8">
          더욱 안정적이고 빠른 뉴스 제공을 위해 <br className="hidden sm:inline" />
          <strong className="text-white font-semibold">데이터베이스 최적화 및 시스템 개편 작업</strong>을 진행하고 있습니다.
        </p>

        {/* 안내 디테일 박스 */}
        <div className="relative z-10 mx-auto max-w-lg rounded-2xl border border-white/5 bg-black/30 p-5 text-left mb-10 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-[#39C5BB] flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-gray-400">
              <p>
                <span className="font-semibold text-gray-200">점검 사유:</span> 뉴스 수집 파이프라인 및 데이터베이스 페이지네이션 개선
              </p>
              <p>
                <span className="font-semibold text-gray-200">이용 안내:</span> 점검 중에는 뉴스 목록 조회가 일시 중단됩니다. 조속히 더 쾌적한 환경으로 복구하도록 하겠습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 다른 페이지 바로가기 액션 버튼 */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#39C5BB] px-5 py-3 text-sm font-bold text-gray-950 transition-all hover:bg-[#34b2a8] hover:shadow-lg hover:shadow-[#39C5BB]/20"
          >
            <Home size={16} />
            홈으로 돌아가기
          </Link>
          <Link
            href="/music"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-200 transition-all hover:bg-white/10 hover:text-white"
          >
            <Music2 size={16} />
            보컬로이드 랭킹
          </Link>
          <Link
            href="/playlists"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-200 transition-all hover:bg-white/10 hover:text-white"
          >
            <ListMusic size={16} />
            플레이리스트
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ==========================================================================
 * [기존 뉴스 목록 컴포넌트 코드 보존]
 * 추후 DB 레벨 페이지네이션(take/skip) 개발 시 복구하여 사용합니다.
 * ==========================================================================
 
import { Suspense } from 'react';
import { CalendarDays, Music2, ArrowRight } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { getVocaNews } from '@/services/newsService';

const ITEMS_PER_PAGE = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function NewsList({ searchParams }: Readonly<{ searchParams: any }>) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams?.page;
  const currentPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const activeTab = resolvedSearchParams?.tab === 'vocaloid' ? 'vocaloid' : 'hatsuneMiku';

  const items = await getVocaNews(activeTab);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">보컬로이드 뉴스</h1>
        <p className="text-lg text-gray-300">다양한 플랫폼에서 수집하여 뉴스를 제공하고 있습니다!</p>
      </div>

      <div className="mb-12 flex justify-center">
        <div className="relative flex w-full max-w-sm items-center rounded-full bg-neutral-900/50 p-1.5 border border-white/10 backdrop-blur-sm">
          <div
            className={`absolute h-[calc(100%-0.75rem)] top-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full transition-transform duration-300 ease-out shadow-lg ${
              activeTab === 'hatsuneMiku' ? 'translate-x-0 bg-teal-500' : 'translate-x-full bg-blue-500'
            }`}
          />
          <Link
            href="/news?tab=hatsuneMiku"
            className="relative z-10 flex-1 rounded-full py-2.5 text-center font-bold text-sm transition-colors duration-300"
          >
            <span className={activeTab === 'hatsuneMiku' ? 'text-white' : 'text-gray-400 hover:text-white'}>하츠네 미쿠</span>
          </Link>
          <Link
            href="/news?tab=vocaloid"
            className="relative z-10 flex-1 rounded-full py-2.5 text-center font-bold text-sm transition-colors duration-300"
          >
            <span className={activeTab === 'vocaloid' ? 'text-white' : 'text-gray-400 hover:text-white'}>보컬로이드</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <a 
              key={item.id} 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-40 h-40 md:h-auto flex-shrink-0 bg-black/10 flex items-center justify-center relative overflow-hidden md:border-r md:border-white/10">
                  <Music2 className="w-12 h-12 text-neutral-600 group-hover:text-teal-400 transition-colors duration-300" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    {item.date && (
                      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        <CalendarDays size={14} />
                        <span>{new Date(item.date).toISOString().split('T')[0]}</span>
                      </div>
                    )}
                    <h3 className="text-base md:text-lg font-semibold text-gray-100 group-hover:text-white transition-colors md:h-14 line-clamp-3 md:line-clamp-2 leading-snug">
                      {item.title_jp}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-teal-400 transition-colors mt-auto pt-4">
                    <span>자세히 보기</span>
                    <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Music2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-medium">관련 뉴스를 찾을 수 없습니다.</p>
            <p className="text-sm text-gray-600 mt-2">나중에 다시 확인해 주세요.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/news?tab=${activeTab}`} />
        </div>
      )}
    </main>
  );
}
========================================================================== */
