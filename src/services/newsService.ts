import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaNews {
  id: number;
  category: string;
  date: Date;
  url: string;
  title_jp: string;
  title_kr: string;
}

export const getVocaNews = unstable_cache(
  async (category: 'hatsuneMiku' | 'vocaloid'): Promise<VocaNews[]> => {
    const news = await prisma.vocaNews.findMany({
      where: { category },
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
  },
  ['voca-news'],
  { revalidate: 21600 }
);
