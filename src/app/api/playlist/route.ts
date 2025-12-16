import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get('platform');
  const playlistId = searchParams.get('playlistId');

  if (!platform || !playlistId) {
    return NextResponse.json({ error: 'Platform and Playlist ID are required' }, { status: 400 });
  }

  try {
    const origin = request.nextUrl.origin;
    let apiUrl = '';

    switch (platform) {
      case 'youtube':
        apiUrl = `${origin}/api/playlist/youtube?playlistId=${playlistId}`;
        break;
      case 'spotify':
        apiUrl = `${origin}/api/playlist/spotify?playlistId=${playlistId}`;
        break;
      default:
        return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      next: { revalidate: 21600 } // 6시간 캐시 (하루 4번)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Internal ${platform} API fetch failed: ${response.statusText}, Body: ${errorBody}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`[API PLAYLIST] Error fetching ${platform} playlist (${playlistId}):`, errorMessage);
    return NextResponse.json({ error: `Failed to fetch ${platform} playlist`, details: errorMessage }, { status: 500 });
  }
}
