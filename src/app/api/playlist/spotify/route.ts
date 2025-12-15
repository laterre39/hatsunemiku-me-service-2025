import { NextRequest, NextResponse } from 'next/server';

// --- 타입 정의 ---
interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylistItem {
  track: SpotifyTrack | null;
}

interface SpotifyPlaylistResponse {
  total: number;
  next: string | null;
  items: SpotifyPlaylistItem[];
}

// 최종 반환될 트랙 객체 타입
interface FormattedTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

// --- 로직 ---
async function getSpotifyToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const data = await response.json();
  return data.access_token;
}

async function getSpotifyPlaylist(playlistId: string) {
  const cleanPlaylistId = playlistId.split('?')[0];
  const token = await getSpotifyToken();
  
  let items: FormattedTrack[] = []; // any[] -> FormattedTrack[]
  let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${cleanPlaylistId}/tracks?limit=50`;
  let totalResults = 0;
  let fetchCount = 0;

  while (nextUrl && fetchCount < 4) {
    const response = await fetch(nextUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify API failed: ${response.statusText}`);
    }

    const data: SpotifyPlaylistResponse = await response.json();
    
    if (fetchCount === 0) {
      totalResults = data.total;
    }

    const fetchedItems: FormattedTrack[] = data.items.map((item: SpotifyPlaylistItem) => {
      if (!item.track) return null;
      return {
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(', '),
        thumbnail: item.track.album.images[0]?.url || '',
        url: item.track.external_urls.spotify,
      };
    }).filter((track): track is FormattedTrack => track !== null); // filter(Boolean) 대신 타입 가드 사용

    items = [...items, ...fetchedItems];
    nextUrl = data.next;
    fetchCount++;
  }

  return {
    totalResults,
    items,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('playlistId');
  
  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const data = await getSpotifyPlaylist(playlistId);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Spotify API Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch Spotify playlist', details: errorMessage }, { status: 500 });
  }
}
