import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaPick {
  id: number;
  videoId: string;
  comment: string | null;
}

/**
 * 모든 추천 비디오(VocaPick)를 조회합니다.
 * Next.js Data Cache를 사용하여 6시간마다 갱신됩니다.
 */
export const getVocaPicks = unstable_cache(
  async (): Promise<VocaPick[]> => {
    const picks = await prisma.vocaPick.findMany({
      orderBy: {
        id: 'desc', // 최신순
      },
    });

    return picks.map((pick) => ({
      id: pick.id,
      videoId: pick.video_id,
      comment: pick.comment,
    }));
  },
  ['voca-picks-list'], // Cache Key
  { 
    revalidate: 21600,
    tags: ['voca-picks'] // Cache Tag
  }
);
