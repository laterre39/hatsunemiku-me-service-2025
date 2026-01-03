import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface VocaPlaylist {
  id: string; // playlist_id (외부 ID)
  platform: 'youtube' | 'spotify';
  title: string; // name -> title로 매핑
  description?: string;
  creator?: string;
  isSlider: boolean;
}

export const getVocaPlaylists = unstable_cache(
  async (): Promise<VocaPlaylist[]> => {
    const playlists = await prisma.vocaPlaylist.findMany({
      orderBy: {
        id: 'asc', // 등록순
      },
    });

    return playlists.map((pl) => ({
      id: pl.playlist_id,
      platform: pl.platform as 'youtube' | 'spotify',
      title: pl.name,
      description: pl.description || undefined,
      creator: pl.creator || undefined,
      isSlider: pl.is_slider,
    }));
  },
  ['voca-playlists'],
  { revalidate: 21600 }
);
