/* eslint-disable @typescript-eslint/no-explicit-any */

import {NextResponse} from 'next/server';
import {google} from 'googleapis';

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

// Type guard to check if an error is a Gaxios-like error
function isGaxiosError(error: any): error is { code: number | string; message: string } {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}


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

    // Initialize the YouTube API client
    const youtube = google.youtube({
        version: 'v3',
        auth: API_KEY,
    });

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
        const searchPromises = keywordGroups.map(group =>
            youtube.search.list({
                part: ['snippet'],
                q: group,
                type: ['video'],
                order: 'viewCount',
                videoCategoryId: '10',
                publishedAfter: publishedAfter,
                maxResults: 50,
            }).catch(err => {
                if (isGaxiosError(err) && Number(err.code) === 403) {
                    throw err;
                }
                console.error(`YouTube search failed for group: ${group}`, err.message);
                return {data: {items: []}};
            })
        );

        const searchResults = await Promise.all(searchPromises);
        const allItems = searchResults.flatMap(result => result.data.items || []);

        // Step 2: Deduplicate results based on videoId
        const uniqueItemsMap = new Map<string, any>();
        allItems.forEach(item => {
            if (item?.id?.videoId && !uniqueItemsMap.has(item.id.videoId)) {
                uniqueItemsMap.set(item.id.videoId, item);
            }
        });
        const uniqueItems = Array.from(uniqueItemsMap.values());

        // Step 3: Primary filter (remove covers, MMD, Topic channels, etc.)
        const nonMusicItems = ['cover', '커버', 'remix', 'mmd', 'project diva', 'diva', 'vrc', 'vrchat', 'バンド', 'english ver', '歌ってみた', 'lyric', 'lyrics', '가사'];
        const filteredItems = uniqueItems.filter((item: any) => {
            const title = item.snippet.title.toLowerCase();
            const channelTitle = item.snippet.channelTitle;

            if (nonMusicItems.some(filterWord => title.includes(filterWord))) {
                return false;
            }
            if (channelTitle.endsWith(' - Topic')) {
                return false;
            }
            return true;
        });

        if (filteredItems.length === 0) {
            return NextResponse.json({lastUpdated: new Date().toISOString(), items: []});
        }

        // Step 4: Fetch video details in chunks (including snippet for tags)
        const videoIds = filteredItems.map((item: any) => item.id.videoId);
        const CHUNK_SIZE = 50;
        const videoDetailPromises = [];

        for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
            const chunk = videoIds.slice(i, i + CHUNK_SIZE);
            videoDetailPromises.push(
                youtube.videos.list({
                    part: ['contentDetails', 'statistics', 'snippet'], // 'snippet' 추가
                    id: chunk,
                })
            );
        }

        const videoDetailResults = await Promise.all(videoDetailPromises);
        const videoDetailsMap = new Map<string, any>();
        videoDetailResults.forEach(result => {
            if (result.data.items) {
                result.data.items.forEach((item: any) => videoDetailsMap.set(item.id, item));
            }
        });

        // Helper function to identify YouTube Shorts
        const isYouTubeShort = (item: any): boolean => {
            const title = item.snippet.title.toLowerCase();
            const description = item.snippet.description?.toLowerCase() || '';
            const tags = item.snippet.tags?.map((tag: string) => tag.toLowerCase()) || [];

            // Check for common short indicators in title, description, or tags
            const shortKeywords = ['#shorts', 'shorts', 'ytshorts', 'youtube shorts', 'short video'];

            if (shortKeywords.some(keyword => title.includes(keyword))) return true;
            if (shortKeywords.some(keyword => description.includes(keyword))) return true;
            if (shortKeywords.some(keyword => tags.includes(keyword))) return true;

            return false;
        };

        // Step 5: Final filter (remove shorts, apply tag-based whitelist) and combine data
        const requiredTags = new Set(['vocaloid', 'ボーカロイド', 'ボカロ', 'オリジナル曲', 'cevio', 'synthesizerv', 'utau', 'vocaloidオリジナル曲']);
        const combinedItems = filteredItems
            .map(item => {
                const details = videoDetailsMap.get(item.id.videoId);
                if (!details) return null;

                // Whitelist filter based on tags
                const videoTags = details.snippet?.tags?.map((tag: string) => tag.toLowerCase()) || [];
                const hasRequiredTag = videoTags.some((tag: string) => requiredTags.has(tag));

                if (!hasRequiredTag) {
                    return null;
                }

                return {
                    ...item,
                    statistics: details.statistics,
                    durationInSeconds: parseISO8601Duration(details.contentDetails.duration),
                    snippet: details.snippet, // Include full snippet for description and tags check
                };
            })
            .filter((item): item is NonNullable<typeof item> => {
                if (item === null) return false;

                // If duration is 60 seconds or less
                if (item.durationInSeconds <= 60) {
                    // Exclude if it's identified as a YouTube Short
                    return !isYouTubeShort(item);
                }
                // If duration is more than 60 seconds, always include
                return true;
            });

        // Step 6: Deduplicate by normalized title and channel
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
            rankingType: 'precise-grouped-tag-filtered',
            keywordsUsed: keywordGroups,
            items: top50Items,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        if (isGaxiosError(error) && Number(error.code) === 403) {
            console.error('Ranking fetch failed: YouTube API quota exceeded.', error.message);
            return NextResponse.json(
                {
                    success: false,
                    message: '데이터를 불러오지 못했습니다. API 요청 한도를 초과했습니다.',
                    error: 'API_QUOTA_EXCEEDED'
                },
                {status: 503}
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Ranking fetch failed:', errorMessage);
        return NextResponse.json(
            {success: false, message: '랭킹을 불러오는 중 오류가 발생했습니다.', error: errorMessage},
            {status: 500}
        );
    }
}
