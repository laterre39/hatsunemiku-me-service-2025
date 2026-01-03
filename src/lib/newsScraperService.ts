/**
 * 뉴스 스크래핑 서비스 (Google News RSS 버전)
 */

import crypto from 'crypto';
import * as cheerio from 'cheerio';
import prisma from './prisma';
import { VocaNews } from "@prisma/client";
import { unstable_cache } from 'next/cache';

// ==================== RSS 피드 URL ====================
const MIKU_RSS_URL = 'https://news.google.com/rss/search?q=%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF&hl=ja&gl=JP&ceid=JP:ja';
const VOCALOID_RSS_URL = 'https://news.google.com/rss/search?q=VOCALOID&hl=ja&gl=JP&ceid=JP:ja';

// ==================== 타입 정의 ====================
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

// ==================== 유틸리티 함수 ====================

function generateExternalId(date: string, title: string): string {
  const content = `${date}_${title.substring(0, 50)}`;
  return crypto.createHash('md5').update(content, 'utf-8').digest('hex');
}

function parseRSSDate(rssDate: string): Date {
  return new Date(rssDate);
}

// ==================== RSS 파싱 함수 ====================

async function fetchRSSFeed(rssUrl: string): Promise<string> {
  try {
    const response = await fetch(rssUrl, {
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.statusText}`);
    }

    return response.text();
  } catch (error) {
    console.error(`❌ RSS 가져오기 실패 (${rssUrl}):`, error);
    throw error;
  }
}

function parseRSSToNewsItems(xmlText: string): RSSItem[] {
  try {
    const $ = cheerio.load(xmlText, { xmlMode: true });

    const items: RSSItem[] = [];

    $('item').each((_, element) => {
      const title = $(element).find('title').text().trim();
      const link = $(element).find('link').text().trim();
      const pubDate = $(element).find('pubDate').text().trim();

      if (title && link && pubDate) {
        items.push({ title, link, pubDate });
      }
    });

    return items;
  } catch (error) {
    console.error("❌ RSS 파싱 실패:", error);
    return [];
  }
}

// ==================== DB 저장 함수 ====================

async function saveNewsToDatabase(category: string, rssItems: RSSItem[]): Promise<{
  saved: number;
  skipped: number;
  errors: number;
}> {
  let saved = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of rssItems) {
    try {
      const parsedDate = parseRSSDate(item.pubDate);
      if (isNaN(parsedDate.getTime())) {
        console.log('⏭️  유효하지 않은 날짜:', item.pubDate);
        skipped++;
        continue;
      }

      const externalId = generateExternalId(
        parsedDate.toISOString().split('T')[0],
        item.title
      );

      await prisma.vocaNews.upsert({
        where: { external_id: externalId },
        update: {
          created_at: new Date(),
        },
        create: {
          external_id: externalId,
          category: category,
          date: parsedDate,
          url: item.link,
          title_jp: item.title,
          title_kr: '',
          created_at: new Date(),
        },
      });

      saved++;
      console.log('✅ 저장 성공:', item.title.substring(0, 30));
    } catch (error) {
      errors++;
      console.error('❌ 저장 실패:', error);
    }
  }

  console.log(`\n📊 저장 완료 (${category}): ${saved}개 저장, ${skipped}개 건너뜀, ${errors}개 에러`);
  return { saved, skipped, errors };
}

// ==================== DB 조회 함수 ====================

// export const getNewsFromDatabase = unstable_cache(
//   async (category: 'hatsuneMiku' | 'vocaloid'): Promise<VocaNews[]> => {
//     try {
//       const dbItems = await prisma.vocaNews.findMany({
//         where: { category },
//         orderBy: { date: 'desc' },
//       });
//       return dbItems;
//     } catch (error) {
//       console.error(`❌ DB 조회 실패 (${category}):`, error);
//       return [];
//     }
//   },
//   ['news-list'],
//   { revalidate: 21600, tags: ['news'] }
// );

// ==================== 통합 함수 ====================

export async function scrapeAndSaveNews(): Promise<{
  success: boolean;
  message: string;
  stats: { saved: number; skipped: number; errors: number };
}> {
  try {
    console.log('🚀 뉴스 RSS 파싱 시작...');

    let totalSaved = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // 하츠네 미쿠 RSS
    console.log('📡 하츠네 미쿠 RSS 가져오기...');
    const mikuXML = await fetchRSSFeed(MIKU_RSS_URL);
    const mikuItems = parseRSSToNewsItems(mikuXML);
    console.log(`✅ 하츠네 미쿠 ${mikuItems.length}개 항목 파싱 완료`);

    const mikuStats = await saveNewsToDatabase('hatsuneMiku', mikuItems);
    totalSaved += mikuStats.saved;
    totalSkipped += mikuStats.skipped;
    totalErrors += mikuStats.errors;

    // VOCALOID RSS
    console.log('📡 VOCALOID RSS 가져오기...');
    const vocaloidXML = await fetchRSSFeed(VOCALOID_RSS_URL);
    const vocaloidItems = parseRSSToNewsItems(vocaloidXML);
    console.log(`✅ VOCALOID ${vocaloidItems.length}개 항목 파싱 완료`);

    const vocaloidStats = await saveNewsToDatabase('vocaloid', vocaloidItems);
    totalSaved += vocaloidStats.saved;
    totalSkipped += vocaloidStats.skipped;
    totalErrors += vocaloidStats.errors;

    console.log(`\n🎉 전체 완료: ${totalSaved}개 저장, ${totalSkipped}개 건너뜀, ${totalErrors}개 에러`);

    return {
      success: true,
      message: `성공적으로 ${totalSaved}개 뉴스를 저장했습니다`,
      stats: { saved: totalSaved, skipped: totalSkipped, errors: totalErrors },
    };

  } catch (error) {
    console.error('❌ RSS 파싱 실패:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러',
      stats: { saved: 0, skipped: 0, errors: 0 },
    };
  }
}
