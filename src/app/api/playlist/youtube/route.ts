import { NextRequest, NextResponse } from 'next/server';
import { google, youtube_v3 } from 'googleapis';
import {GaxiosResponseWithHTTP2} from "googleapis-common";

// --- 타입 정의 ---
interface FormattedTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

async function getYouTubePlaylist(playlistId: string) {
  const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });
  let items: FormattedTrack[] = [];
  let nextPageToken: string | undefined | null = undefined;
  let totalResults = 0;

  for (let i = 0; i < 4; i++) {
    try {
      const response: GaxiosResponseWithHTTP2<youtube_v3.Schema$PlaylistItemListResponse> = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      if (i === 0) {
        totalResults = response.data.pageInfo?.totalResults || 0;
      }

      const fetchedItems = response.data.items?.map((item: youtube_v3.Schema$PlaylistItem) => {
        const snippet = item.snippet;
        if (!snippet || !snippet.resourceId?.videoId) return null;
        
        return {
          id: snippet.resourceId.videoId,
          title: snippet.title || 'Untitled',
          artist: snippet.videoOwnerChannelTitle || 'Unknown Artist',
          thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
          url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
        };
      }).filter((track: FormattedTrack | null): track is FormattedTrack => track !== null);

      if (fetchedItems) {
        items = [...items, ...fetchedItems];
      }
      
      nextPageToken = response.data.nextPageToken;

      if (!nextPageToken) break;
    } catch (error) {
      console.error('Error fetching YouTube page:', error);
      break;
    }
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
    const data = await getYouTubePlaylist(playlistId);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('YouTube API Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch YouTube playlist', details: errorMessage }, { status: 500 });
  }
}
