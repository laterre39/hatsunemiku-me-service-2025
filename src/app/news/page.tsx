import {Suspense} from 'react';
import * as cheerio from 'cheerio';
import Link from 'next/link';
import {CalendarDays, Newspaper} from 'lucide-react';
import Pagination from '../../components/Pagination';

const TARGET_URL = 'https://w.atwiki.jp/hmiku/pages/912.html';
const ITEMS_PER_PAGE = 10;

interface WikiItem {
    id: number;
    date: string | null;
    htmlContent: string | null;
}

interface ScrapedData {
    hatsuneMiku: WikiItem[];
    vocaloid: WikiItem[];
}

// 위키 페이지에서 li 항목들을 스크래핑하는 함수
async function scrapeWikiItems(): Promise<ScrapedData> {
    try {
        const response = await fetch(TARGET_URL, { next: { revalidate: 3600 } });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        const hatsuneMiku: WikiItem[] = [];
        const vocaloid: WikiItem[] = [];

        const processNewsBlock = (newsBlock: cheerio.Cheerio<any>, category: 'hatsuneMiku' | 'vocaloid') => {
            const items = category === 'hatsuneMiku' ? hatsuneMiku : vocaloid;
            newsBlock.find('ul.recent_list > li').each((index, liElement) => {
                const fullHtml = $(liElement).html() || '';
                const cleanedHtml = fullHtml.replace(/、?タグ：.*/g, '');
                const textContent = $(liElement).text();
                const dateMatch = textContent.match(/^(\d{4}-\d{2}-\d{2})/);
                const date = dateMatch ? dateMatch[1] : null;
                const contentHtml = date ? cleanedHtml.replace(new RegExp(`^${date}\\s*-\s*`), '') : cleanedHtml;

                items.push({
                    id: items.length + index,
                    date: date,
                    htmlContent: contentHtml.trim(),
                });
            });
        };

        $('#wikibody ul').each((_, ul) => {
            const $ul = $(ul);
            const liHtml = $ul.find('li:first-child').html();

            if (liHtml && liHtml.includes('初音ミク</span>を含むニュース')) {
                const newsBlock = $ul.next('div.plugin_gnews');
                if (newsBlock.length) {
                    processNewsBlock(newsBlock, 'hatsuneMiku');
                }
            } else if (liHtml && liHtml.includes('VOCALOID</span>を含むニュース')) {
                const newsBlock = $ul.next('div.plugin_gnews');
                if (newsBlock.length) {
                    processNewsBlock(newsBlock, 'vocaloid');
                }
            }
        });

        return { hatsuneMiku, vocaloid };

    } catch (error) {
        console.error("Failed to scrape wiki items:", error);
        return { hatsuneMiku: [], vocaloid: [] };
    }
}

// NewsList 컴포넌트: 데이터를 가져와 목록을 렌더링
async function NewsList({ searchParams }: { searchParams?: { page?: string, tab?: string } }) {
    const sp = await searchParams;
    const currentPage = Number(sp?.page) || 1;
    const activeTab = sp?.tab === 'vocaloid' ? 'vocaloid' : 'hatsuneMiku';

    const { hatsuneMiku, vocaloid } = await scrapeWikiItems();
    const items = activeTab === 'vocaloid' ? vocaloid : hatsuneMiku;

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

            {/* Capsule Tabs */}
            <div className="mb-12 flex justify-center">
                <div className="relative flex w-full max-w-xs items-center rounded-full bg-black/25 p-1">
                    <div
                        className={`absolute h-full top-0 left-0 w-1/2 rounded-full transition-transform duration-300 ease-in-out p-1 ${
                            activeTab === 'hatsuneMiku' ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                        <div className="w-full h-full rounded-full bg-cyan-400/90" />
                    </div>
                    <Link
                        href="/news?tab=hatsuneMiku"
                        className="relative z-10 flex-1 rounded-full py-2 text-center font-semibold text-sm transition-colors duration-300"
                    >
                        <span className={activeTab === 'hatsuneMiku' ? 'text-black' : 'text-white/80'}>Hatsune Miku</span>
                    </Link>
                    <Link
                        href="/news?tab=vocaloid"
                        className="relative z-10 flex-1 rounded-full py-2 text-center font-semibold text-sm transition-colors duration-300"
                    >
                        <span className={activeTab === 'vocaloid' ? 'text-black' : 'text-white/80'}>Vocaloid</span>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 flex overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10">
                            <div className="flex-shrink-0 flex items-center justify-center w-20 bg-black/10 border-r border-white/5">
                                <Newspaper size={28} className="text-white/50" />
                            </div>
                            <div className="p-5 flex-grow">
                                {item.date && (
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <CalendarDays size={16} className="text-cyan-400/80" />
                                        <span className="font-semibold text-sm text-white/80 tracking-wide">{item.date}</span>
                                    </div>
                                )}
                                <div
                                    className="prose prose-invert prose-sm max-w-none text-gray-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-p:my-1"
                                    dangerouslySetInnerHTML={{ __html: item.htmlContent || '' }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-xl text-gray-500">관련 뉴스를 찾을 수 없습니다.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/news?tab=${activeTab}`} />
            )}
        </main>
    );
}

// 메인 페이지 컴포넌트
export default function NewsPage({ searchParams }: { searchParams?: { page?: string, tab?: string } }) {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
            <NewsList searchParams={searchParams} />
        </Suspense>
    );
}
