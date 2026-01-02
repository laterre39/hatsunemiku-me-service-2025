import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaCommunity {
  id: number;
  name: string;
  description: string;
  url: string;
}

export const getVocaCommunities = unstable_cache(
  async (): Promise<VocaCommunity[]> => {
    const communities = await prisma.vocaCommunity.findMany({
      orderBy: {
        id: 'asc', // 등록순
      },
    });

    return communities.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      url: community.url,
    }));
  },
  ['voca-communities'],
  { revalidate: 21600 }
);
