import PlaylistsClient from '@/components/PlaylistsClient';
import { Metadata } from "next";
import { getVocaPlaylists } from "@/services/playlistService";

export const metadata: Metadata = {
  title: 'Playlist',
  description: '취향 저격 보카로 플리, 지금 바로 들어보세요.',
  openGraph: {
    title: 'Playlist | HATSUNEMIKU.ME',
    description: '취향 저격 보카로 플리, 지금 바로 들어보세요.',
    url: 'https://hatsunemiku.me/playlists',
  },
};

export default async function PlaylistsPage() {
  // DB에서 플레이리스트 목록 조회
  const playlists = await getVocaPlaylists();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <PlaylistsClient playlists={playlists} />
    </main>
  );
}
