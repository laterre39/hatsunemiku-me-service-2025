import { NextResponse } from 'next/server';

// Revalidate at most every 6 hours
export const revalidate = 21600;

// VocaDB API에서 사용하는 노래 타입 정의
interface VocaDbSong {
    id: number;
    name: string;
    artistString: string;
    thumbUrl: string;
    publishDate: string;
    songType: string;
    pvs: Array<{
        service: string;
        pvType: string;
        url: string;
        thumbUrl: string;
    }>;
}

export async function GET() {
    const apiUrl = new URL('https://vocadb.net/api/songs');
    
    // Parameters for the /api/songs endpoint
    apiUrl.searchParams.append('sort', 'RatingScore');
    apiUrl.searchParams.append('since', "2160");
    apiUrl.searchParams.append('pvServices', 'Youtube, NicoNicoDouga');
    apiUrl.searchParams.append('fields', 'Artists, PVs');
    apiUrl.searchParams.append('maxResults', '50');

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
        const songs = data.items;

        const top50Songs = songs.slice(0, 50);

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
