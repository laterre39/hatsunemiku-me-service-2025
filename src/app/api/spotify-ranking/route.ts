/* eslint-disable @typescript-eslint/no-explicit-any */

import {NextResponse} from 'next/server';

// Revalidate at most every 3 hours (3 * 60 * 60 = 10800 seconds)
export const revalidate = 10800;

// 스포티파이 API 액세스 토큰을 가져오는 함수
async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Spotify client ID or secret is not set in environment variables.');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Spotify Auth Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.access_token;
}

// 검색할 음성 합성 엔진 아티스트 목록
const VOICE_SYNTH_ARTISTS = [
    // VOCALOID
    'Hatsune Miku', '初音ミク',
    'Kagamine Rin', '鏡音リン',
    'Kagamine Len', '鏡音レン',
    'Megurine Luka', '巡音ルカ',
    'KAITO', 'カイト',
    'MEIKO', 'メイコ',
    'GUMI', 'グミ',
    'IA', 'イア',
    // UTAU
    'Kasane Teto', '重音テト',
    // CeVIO AI, Synthesizer V, etc.
    'Kafu', '可不', 'Sekai', '星界',
    'Tsurumaki Maki', '弦巻マキ',
    'Yuzuki Yukari', '結月ゆかり',
    'Zundamon', 'ずんだもん',
    'Kotonoha Akane', '琴葉 茜',
    'Kotonoha Aoi', '琴葉 葵',
];

// 스포티파이 API로부터 월간 랭킹을 가져오는 함수
async function getVoiceSynthRanking() {
    const accessToken = await getAccessToken();
    const voiceSynthArtistSet = new Set(VOICE_SYNTH_ARTISTS);

    // 1. 각 아티스트에 대한 검색 작업을 병렬로 실행
    const searchPromises = VOICE_SYNTH_ARTISTS.map(artist => {
        const query = encodeURIComponent(`artist:"${artist}"`);
        const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50`;
        return fetch(url, {headers: {'Authorization': `Bearer ${accessToken}`}});
    });

    const responses = await Promise.all(searchPromises);

    // 2. 모든 결과를 하나의 배열로 취합
    const allTracks: any[] = [];
    for (const response of responses) {
        if (response.ok) {
            const data = await response.json();
            if (data?.tracks.items) {
                allTracks.push(...data.tracks.items);
            }
        }
    }

    // 3. 중복 트랙 제거 (ID 기준)
    const uniqueTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());

    // 4. 2단계 필터링: 트랙의 아티스트 목록에 우리가 찾는 아티스트가 포함되어 있는지 확인
    const filteredTracks = uniqueTracks.filter(track =>
        track.artists.some((artist: any) => voiceSynthArtistSet.has(artist.name))
    );

    // 5. 인기도(popularity) 순으로 정렬
    const sortedTracks = filteredTracks.toSorted((a, b) => b.popularity - a.popularity);

    // 6. 상위 50개 결과만 반환
    return sortedTracks.slice(0, 50);
}

/**
 * GET /api/spotify-ranking
 * 스포티파이의 최신 음성 합성 엔진 음악 랭킹을 가져와 반환합니다.
 */
export async function GET() {
    try {
        const rankingData = await getVoiceSynthRanking();

        const dataToReturn = {
            lastUpdated: new Date().toISOString(),
            rankingType: 'yearly-voice-synth',
            artists: VOICE_SYNTH_ARTISTS,
            items: rankingData,
        };

        return NextResponse.json({
            success: true,
            message: 'Successfully retrieved Spotify voice-synth ranking.',
            data: dataToReturn,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Spotify ranking retrieval failed:', errorMessage);
        return NextResponse.json(
            {success: false, message: 'Failed to retrieve Spotify ranking.', error: errorMessage},
            {status: 500}
        );
    }
}
