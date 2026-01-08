import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaBirthday {
  id: number;
  name: string;
  date: Date;
  color: string;
}

export const getVocaBirthdays = unstable_cache(
  async (): Promise<VocaBirthday[]> => {
    const birthdays = await prisma.vocaBirthday.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return birthdays.map((item) => ({
      id: item.id,
      name: item.name,
      date: item.date,
      color: item.color,
    }));
  },
  ['voca-birthdays'],
  { 
    revalidate: 21600,
    tags: ['voca-birthdays']
  }
);
