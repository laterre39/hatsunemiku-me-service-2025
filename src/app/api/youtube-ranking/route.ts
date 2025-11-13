/* eslint-disable @typescript-eslint/no-explicit-any */

import {NextResponse} from 'next/server';

// Revalidate at most every 12 hours (12 * 60 * 60 = 43200 seconds)
export const revalidate = 43200;

// Helper function to parse ISO 8601 duration to seconds
function parseISO8601Duration(isoDuration: string): number {
    const match = RegExp(/PT(\d+H)?(\d+M)?(\d+S)?/).exec(isoDuration);
    if (!match) return 0;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    return hours * 3600 + minutes * 60 + seconds;
}

// Helper function to normalize title for deduplication
const normalizeTitle = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/\(feat\. .+\)/, '')
        .replace(/(\s*-\s*)?(feat|ft)\.?\s*.+/, '')
        .replace(/(\s*-\s*)?(remix|ver|version|edit|instrumental).*/, '')
        .replace(/(\s*-\s*)?(official|mv|pv|audio|lyric).*/, '')
        .replace(/【.*】/, '')
        .replace(/\[.*\]/, '')
        .replace(/\(.*\)/, '')
        .replace(/\|.*/, '')
        .trim();
};


/**
 * GET /api/youtube-ranking
 * Fetches YouTube rankings using highly specific, grouped keywords to ensure accuracy and efficiency.
 */
export async function GET() {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        console.error('YouTube API key is not set in environment variables.');
        return NextResponse.json(
            {success: false, message: 'Server configuration error: YouTube API key is missing.'},
            {status: 500}
        );
    }

    // Calculate the date 3 months ago from today
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const publishedAfter = threeMonthsAgo.toISOString();

    // Highly specific keyword groups to improve search accuracy
    const keywordGroups = [
        'vocaloid | ボーカロイド',
        'hatsune miku | 初音ミク',
        'kagamine rin | 鏡音リン',
        'kagamine len | 鏡音レン',
        'megurine luka | 巡音ルカ',
        'kaito vocaloid | カイト ボーカロイド',
        'meiko vocaloid | メイコ ボーカロイド',
        'gumi | グミ',
        'ia vocaloid | イア ボーカロイド',
        'kasane teto | 重音テト',
        'kafu CeVIO AI | 可不 チェビオAI',
        'sekai CeVIO AI | 星界 チェビオAI',
        'tsurumaki maki | 弦巻マキ',
        'yuzuki yukari | 結月ゆかり',
        'zundamon | ずんだもん',
        'kotonoha akane | 琴葉 茜',
        'kotonoha aoi | 琴葉 葵',
        'project sekai | プロセカ'
    ];

    try {
        // Step 1: Search for top 50 videos for each keyword group concurrently
        const searchPromises = keywordGroups.map(group => {
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(group)}&type=video&order=viewCount&videoCategoryId=10&publishedAfter=${publishedAfter}&maxResults=50&key=${API_KEY}`;
            return fetch(searchUrl).then(res => {
                if (!res.ok) {
                    console.error(`YouTube search failed for group: ${group}, status: ${res.status}`);
                    return {items: []};
                }
                return res.json();
            });
        });

        const searchResults = await Promise.all(searchPromises);
        const allItems = searchResults.flatMap(result => result.items);

        // Step 2: Deduplicate results based on videoId
        const uniqueItemsMap = new Map<string, any>();
        allItems.forEach(item => {
            if (item?.id?.videoId && !uniqueItemsMap.has(item.id.videoId)) {
                uniqueItemsMap.set(item.id.videoId, item);
            }
        });
        const uniqueItems = Array.from(uniqueItemsMap.values());

        // Step 3: Primary filter (remove covers, MMD, Topic channels, etc.)
        const nonMusicItems = ['cover', '커버', 'remix', 'mmd', 'project diva', 'diva', 'vrc', 'vrchat', 'バンド', 'english ver'];
        const filteredItems = uniqueItems.filter((item: any) => {
            const title = item.snippet.title.toLowerCase();
            const channelTitle = item.snippet.channelTitle;

            // Exclude if title contains non-music keywords
            if (nonMusicItems.some(filterWord => title.includes(filterWord))) {
                return false;
            }

            // Exclude if it's a "Topic" channel
            if (channelTitle.endsWith(' - Topic')) {
                return false;
            }

            return true;
        });

        if (filteredItems.length === 0) {
            return NextResponse.json({lastUpdated: new Date().toISOString(), items: []});
        }

        // Step 4: Fetch video details in chunks
        const videoIds = filteredItems.map((item: any) => item.id.videoId);
        const CHUNK_SIZE = 50;
        const videoDetailPromises = [];

        for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
            const chunk = videoIds.slice(i, i + CHUNK_SIZE);
            const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${chunk.join(',')}&key=${API_KEY}`;
            videoDetailPromises.push(fetch(videosUrl).then(res => res.json()));
        }

        const videoDetailResults = await Promise.all(videoDetailPromises);
        const videoDetailsMap = new Map<string, any>();
        videoDetailResults.forEach(result => {
            if (result.items) {
                result.items.forEach((item: any) => videoDetailsMap.set(item.id, item));
            }
        });

        // Step 5: Final filter (remove shorts) and combine data
        const combinedItems = filteredItems
            .map(item => {
                const details = videoDetailsMap.get(item.id.videoId);
                if (!details) return null;

                return {
                    ...item,
                    statistics: details.statistics,
                    durationInSeconds: parseISO8601Duration(details.contentDetails.duration),
                };
            })
            .filter((item): item is NonNullable<typeof item> => {
                return item !== null && item.durationInSeconds > 60;
            });

        // Step 6: Deduplicate by normalized title and channel, keeping the one with the highest view count
        const songMap = new Map<string, any>();
        combinedItems.forEach(item => {
            const normalizedTitle = normalizeTitle(item.snippet.title);
            const songKey = `${normalizedTitle}|${item.snippet.channelTitle}`;

            const existingItem = songMap.get(songKey);
            if (!existingItem || parseInt(item.statistics.viewCount, 10) > parseInt(existingItem.statistics.viewCount, 10)) {
                songMap.set(songKey, item);
            }
        });
        const finalItems = Array.from(songMap.values());


        // Step 7: Sort by view count (descending)
        finalItems.sort((a, b) => parseInt(b.statistics.viewCount, 10) - parseInt(a.statistics.viewCount, 10));

        // Step 8: Get the top 50 and format the response
        const top50Items = finalItems.slice(0, 50);
        const responseData = {
            lastUpdated: new Date().toISOString(),
            rankingType: 'precise-grouped',
            keywordsUsed: keywordGroups,
            items: top50Items,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Ranking fetch failed:', errorMessage);
        return NextResponse.json(
            {success: false, message: 'Failed to fetch ranking.', error: errorMessage},
            {status: 500}
        );
    }
}
