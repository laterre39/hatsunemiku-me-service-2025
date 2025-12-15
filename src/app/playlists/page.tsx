import PlaylistsClient from '@/components/PlaylistsClient';
import {vocaloidPlaylists} from '@/data/vocaloidPlaylists';
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Playlist',
  description: '취향 저격 보카로 플리, 지금 바로 들어보세요.',
  openGraph: {
    title: 'Playlist | HATSUNEMIKU.ME',
    description: '취향 저격 보카로 플리, 지금 바로 들어보세요.',
    url: 'https://hatsunemiku.me/about',
  },
};

export default function PlaylistsPage() {
  // 서버 컴포넌트에서는 데이터 페칭이나 준비만 수행
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <PlaylistsClient playlists={vocaloidPlaylists} />
    </main>
  );
}
