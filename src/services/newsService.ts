// import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaNews {
  id: number;
  category: string;
  date: Date;
  url: string;
  title_jp: string;
  title_kr: string;
}

/**
 * [점검 중] DB Egress 과다 발생 방지를 위해 일시적으로 빈 배열 반환
 * 추후 DB 레벨 페이지네이션(take/skip) 및 select 필드 최적화 구현 예정
 */
export const getVocaNews = unstable_cache(
  async (_category: 'hatsuneMiku' | 'vocaloid'): Promise<VocaNews[]> => {
    return [];

    /* 기존 코드 보존 (추후 개발 시 복구 및 최적화)
    const news = await prisma.vocaNews.findMany({
      where: { category: _category },
      orderBy: { date: 'desc' },
    });

    return news.map((item) => ({
      id: item.id,
      category: item.category,
      date: item.date,
      url: item.url,
      title_jp: item.title_jp,
      title_kr: item.title_kr,
    }));
    */
  },
  ['voca-news-list'], // Cache Key
  { 
    revalidate: 21600,
    tags: ['voca-news'] // Cache Tag
  }
);
