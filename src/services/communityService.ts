import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaCommunity {
  id: number;
  name: string;
  description: string;
  url: string;
}

/**
 * 모든 보컬로이드 커뮤니티를 조회합니다.
 */
export const getVocaCommunities = unstable_cache(
  async (): Promise<VocaCommunity[]> => {
    const communities = await prisma.vocaCommunity.findMany({
      orderBy: [
        { order: 'asc' }, // 순서 기준 정렬
        { id: 'desc' }    // 같은 순서일 경우 최신순
      ],
    });

    return communities.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      url: item.url,
    }));
  },
  ['voca-communities-list'], // Cache Key
  { 
    revalidate: 21600,
    tags: ['voca-communities'] // Cache Tag
  }
);
