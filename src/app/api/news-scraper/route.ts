/**
 * 수동 뉴스 스크래핑 API
 * 
 * [임시 비활성화 / 점검 중]
 * Supabase DB Egress 과다 발생 방지 및 최적화 작업을 위해 일시적으로 실행을 중단합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
// import { scrapeAndSaveNews } from '@/lib/newsScraperService';

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: '수동 뉴스 스크래핑 기능이 점검 및 최적화를 위해 임시 비활성화되었습니다.',
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );

  /* 기존 코드 보존 (추후 개발 시 복구)
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
  */
}

export async function GET() {
  return NextResponse.json({
    message: '뉴스 스크래퍼 API (점검 중)',
    status: 'MAINTENANCE',
    description: '뉴스 스크래핑 기능이 임시 점검 중입니다.',
  });
}
