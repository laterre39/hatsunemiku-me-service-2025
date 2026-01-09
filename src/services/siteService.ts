import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaSite {
  id: number;
  name: string;
  url: string;
  show: boolean;
}

export const getVocaSites = unstable_cache(
  async (): Promise<VocaSite[]> => {
    const sites = await prisma.vocaSite.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'desc' }
      ],
    });

    return sites.map((site) => ({
      id: site.id,
      name: site.name,
      url: site.url,
      show: site.show,
    }));
  },
  ['voca-sites-list'], // Cache Key
  { 
    revalidate: 21600,
    tags: ['voca-sites'] // Cache Tag
  }
);
