import { VocaPlaylist } from "@/services/playlistService";
import PlaylistCardFeatured from "./PlaylistCardFeatured";

interface FeaturedPlaylistsProps {
  playlists: VocaPlaylist[];
  onMoveToPlaylist: (playlistId: string, platform: string) => void;
}

export default function FeaturedPlaylists({ playlists, onMoveToPlaylist }: FeaturedPlaylistsProps) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {playlists.map((playlist) => (
          <PlaylistCardFeatured
            key={`${playlist.platform}-${playlist.id}`}
            playlistId={playlist.id}
            platform={playlist.platform}
            playlistTitle={playlist.title}
            description={playlist.description}
            creator={playlist.creator}
            onMoveToPlaylist={onMoveToPlaylist}
          />
        ))}
      </div>
    </section>
  );
}
