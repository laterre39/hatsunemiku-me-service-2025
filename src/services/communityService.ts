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
        id: 'asc',
      },
    });

    return communities.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      url: item.url,
    }));
  },
  ['voca-communities-list'],
  { 
    revalidate: 21600,
    tags: ['voca-communities']
  }
);
