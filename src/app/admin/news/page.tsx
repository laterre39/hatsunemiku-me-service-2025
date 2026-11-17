import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
import NewsManagementClient from "@/components/NewsManagementClient";
import { Newspaper, ArrowLeft, LayoutDashboard, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AccessDenied from "@/components/AccessDenied";

export default async function NewsManagementPage() {
  const session = await getServerSession(authOptions);

  // ADMIN 또는 STAFF 권한 체크
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    if (!session) {
      redirect("/auth/signin?callbackUrl=/admin/news");
    }
    return <AccessDenied />;
  }

  // [점검 중] DB Egress 과다 발생 방지를 위해 일시적으로 빈 배열 전달
  // 추후 관리자 페이지도 DB 레벨 페이징 처리 예정
  const serializedNews: Array<{
    id: number;
    external_id: string;
    category: string;
    created_at: Date;
    date: string;
    url: string;
    title_jp: string;
    title_kr: string;
  }> = [];

  /* 기존 코드 보존 (추후 개발 시 복구)
  const news = await prisma.vocaNews.findMany({
    orderBy: { date: 'desc' },
  });

  const serializedNews = news.map(item => ({
    ...item,
    date: item.date.toISOString(),
  }));
  */

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                <LayoutDashboard size={14} />
                관리자 대시보드
              </Link>
              <ChevronRight size={14} />
              <span className="text-[#39C5BB]">뉴스 관리</span>
            </div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Newspaper className="text-blue-400" />
              뉴스 관리
            </h1>
            <p className="mt-2 text-gray-400">보컬로이드 관련 뉴스 관리</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              뒤로가기
            </Link>
            <LogoutButton className="group inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300" iconSize={16} />
          </div>
        </header>

        {/* 점검 알림 배너 */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          <AlertTriangle size={20} className="flex-shrink-0 text-amber-400" />
          <p className="text-sm">
            <strong>[시스템 알림]</strong> 현재 뉴스 기능은 데이터베이스 부하 방지 및 성능 개선을 위해 서비스 점검 상태입니다. DB 직접 조회가 임시 차단되어 있습니다.
          </p>
        </div>

        <NewsManagementClient initialNews={serializedNews} />
      </div>
    </div>
  );
}
