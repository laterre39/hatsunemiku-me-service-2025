import prisma from "@/lib/prisma";
import { VocaEvent } from "@/types/event";
import { unstable_cache } from "next/cache";

export const getVocaEvents = unstable_cache(
  async (): Promise<VocaEvent[]> => {
    const events = await prisma.vocaEvent.findMany({
      orderBy: {
        start_date: 'asc',
      },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      startDate: event.start_date,
      endDate: event.end_date,
      url: event.url,
      comment: event.comment,
    }));
  },
  ['voca-events-list'], // Cache Key
  { 
    revalidate: 21600,
    tags: ['voca-events'] // Cache Tag
  }
);
