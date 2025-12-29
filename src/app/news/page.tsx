import { Suspense } from 'react';
import Link from 'next/link';
import { CalendarDays, Music2, ArrowRight } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { getNewsFromDatabase } from '@/lib/newsScraperService';

const ITEMS_PER_PAGE = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function NewsList({ searchParams }: Readonly<{ searchParams: any }>) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams?.page;
  const currentPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const activeTab = resolvedSearchParams?.tab === 'vocaloid' ? 'vocaloid' : 'hatsuneMiku';

  const items = await getNewsFromDatabase(activeTab);

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

      {/* 탭 전환 */}
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

      {/* 뉴스 목록 */}
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
                {/* 썸네일/아이콘 영역 */}
                <div className="md:w-40 h-40 md:h-auto flex-shrink-0 bg-black/10 flex items-center justify-center relative overflow-hidden md:border-r md:border-white/10">
                  <Music2 className="w-12 h-12 text-neutral-600 group-hover:text-teal-400 transition-colors duration-300" />
                </div>
                
                {/* 콘텐츠 영역 */}
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    {item.date && (
                      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        <CalendarDays size={14} />
                        <span>{item.date.toISOString().split('T')[0]}</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors h-14 line-clamp-2 leading-snug">
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/news?tab=${activeTab}`} />
        </div>
      )}
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function NewsPage({ searchParams }: Readonly<{ searchParams: any }>) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
      <NewsList searchParams={searchParams} />
    </Suspense>
  );
}
