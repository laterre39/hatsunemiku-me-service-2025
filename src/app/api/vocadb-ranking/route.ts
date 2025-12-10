import { NextResponse } from 'next/server';

// Revalidate at most every 6 hours
export const revalidate = 21600;

interface VocaDbSong {
    id: number;
    name: string;
    defaultName: string;
    artistString: string;
    thumbUrl: string;
    publishDate: string;
    songType: string;
    lengthSeconds: number;
    pvs: Array<{
        service: string;
        pvType: string;
        url: string;
        thumbUrl: string;
        disabled: boolean;
    }>;
    webLinks: Array<{ // webLinks 속성 추가
        category: string;
        description: string;
        disabled: boolean;
        url: string;
    }>;
}

export async function GET() {
    const apiUrl = new URL('https://vocadb.net/api/songs');
    
    apiUrl.searchParams.append('sort', 'RatingScore');
    apiUrl.searchParams.append('since', "2160");
    apiUrl.searchParams.append('songTypes', 'Original, Remix, Remaster');
    apiUrl.searchParams.append('pvServices', 'Youtube, NicoNicoDouga');
    apiUrl.searchParams.append('fields', 'Artists, PVs, WebLinks');
    apiUrl.searchParams.append('maxResults', '100');

    try {
        const response = await fetch(apiUrl.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`VocaDB API Error: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch from VocaDB: ${response.statusText}`);
        }

        const data: { items: VocaDbSong[] } = await response.json();
        
        const uniqueSongs = [];
        const seenNames = new Set();

        for (const song of data.items) {
            const normalizedName = song.defaultName.trim().toLowerCase();
            if (!seenNames.has(normalizedName)) {
                uniqueSongs.push(song);
                seenNames.add(normalizedName);
            }
        }

        const songsWithValidPvs = uniqueSongs
            .map(song => ({
                ...song,
                pvs: song.pvs.filter(pv => !pv.disabled),
            }))
            .filter(song => song.pvs.length > 0);

        const top50Songs = songsWithValidPvs.slice(0, 50);

        return NextResponse.json({
            lastUpdated: new Date().toISOString(),
            items: top50Songs,
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('VocaDB API processing error:', errorMessage);
        return NextResponse.json(
            { message: 'VocaDB 랭킹을 불러오는 중 오류가 발생했습니다.', error: errorMessage },
            { status: 500 }
        );
    }
}
