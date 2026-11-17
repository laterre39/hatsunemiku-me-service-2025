/**
 * 자동 뉴스 스크래핑 Cron API
 * 
 * [임시 비활성화 / 점검 중]
 * Supabase DB Egress 과다 발생 방지 및 최적화 작업을 위해 일시적으로 실행을 중단합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
// import { scrapeAndSaveNews } from '@/lib/newsScraperService';

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: '뉴스 스크래핑 크론이 점검 및 최적화를 위해 임시 비활성화되었습니다.',
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );

  /* 기존 코드 보존 (추후 개발 시 복구)
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
  */
}
