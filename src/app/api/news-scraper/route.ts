/**
 * 수동 뉴스 스크래핑 API
 * 
 * 사용법: POST http://localhost:3000/api/news-scraper
 */

import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndSaveNews } from '@/lib/newsScraperService';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 수동 스크래핑 요청 받음:', new Date().toISOString());

    const result = await scrapeAndSaveNews();

    return NextResponse.json({
      success: result.success,
      message: result.message,
      stats: result.stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ 수동 스크래핑 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 에러',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '뉴스 스크래퍼 API입니다',
    usage: 'POST /api/news-scraper',
    description: '수동으로 뉴스 스크래핑을 실행합니다',
  });
}