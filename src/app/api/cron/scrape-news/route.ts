/**
 * 자동 뉴스 스크래핑 Cron API
 * 
 * 매일 자정에 Vercel Cron이 자동 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndSaveNews } from '@/lib/newsScraperService';

export async function GET(request: NextRequest) {
  try {
    // 보안: CRON_SECRET 검증
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.error('❌ 인증 실패: 잘못된 CRON_SECRET');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('⏰ 자동 스크래핑 시작:', new Date().toISOString());

    const result = await scrapeAndSaveNews();

    return NextResponse.json({
      success: result.success,
      message: result.message,
      stats: result.stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ 자동 스크래핑 실패:', error);
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