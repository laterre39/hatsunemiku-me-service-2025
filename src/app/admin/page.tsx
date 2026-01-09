import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Calendar, Music, Users, Newspaper, ListMusic, Globe, Gift, LogOut, ShieldAlert, ArrowUpRight, UserCog } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import AccessDenied from "@/components/AccessDenied";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // ADMIN 또는 STAFF 권한 체크
  if (!["ADMIN", "STAFF"].includes(session.user.role)) {
    return <AccessDenied />;
  }

  const menuItems = [
    // 사용자 관리: 높이 2배 (row-span-2)
    { name: "사용자 관리", href: "/admin/users", icon: UserCog, description: "회원 목록 조회 및 권한 설정", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", shadow: "shadow-orange-400/20", size: "col-span-1 md:col-span-2 row-span-2", requiredRole: "ADMIN" },
    { name: "추천 영상 관리", href: "/admin/picks", icon: Music, description: "메인 페이지 추천 영상 관리", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", shadow: "shadow-purple-400/20", size: "col-span-1 md:col-span-2" },
    { name: "플레이리스트 관리", href: "/admin/playlists", icon: ListMusic, description: "유튜브/스포티파이 플리 관리", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", shadow: "shadow-green-400/20", size: "col-span-1 md:col-span-2" },
    { name: "커뮤니티 관리", href: "/admin/communities", icon: Users, description: "보컬로이드 커뮤니티 목록 관리", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", shadow: "shadow-yellow-400/20", size: "col-span-1 md:col-span-2" },
    { name: "생일 정보 관리", href: "/admin/birthdays", icon: Gift, description: "캐릭터 생일 및 기념일 관리", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", shadow: "shadow-pink-400/20", size: "col-span-1 md:col-span-2" },
    { name: "사이트 링크 관리", href: "/admin/sites", icon: Globe, description: "푸터 및 관련 사이트 링크 관리", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", shadow: "shadow-indigo-400/20", size: "col-span-1 md:col-span-2" },
    { name: "이벤트 관리", href: "/admin/events", icon: Calendar, description: "공식/비공식 행사 일정 관리", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", shadow: "shadow-cyan-400/20", size: "col-span-1 md:col-span-2" },
    { name: "뉴스 관리", href: "/admin/news", icon: Newspaper, description: "보컬로이드 관련 뉴스 관리", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-400/20", size: "col-span-1 md:col-span-2" },
  ];

  // 권한에 따라 메뉴 필터링
  const filteredMenuItems = menuItems.filter(item => {
    if (item.requiredRole === "ADMIN" && session.user.role !== "ADMIN") {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
              <LayoutDashboard className="text-[#39C5BB]" size={28} />
              관리자 대시보드
            </h1>
            <p className="mt-1 text-sm text-gray-400">환영합니다, <span className="font-semibold text-white">{session.user.name}</span>님.</p>
          </div>
          <LogoutButton className="group inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300" iconSize={16} />
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 auto-rows-[minmax(140px,auto)]">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 ${item.size}`}
            >
              {/* 은은한 배경 오로라 효과 */}
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${item.bg} blur-[50px] transition-all duration-700 group-hover:opacity-80 opacity-40`}></div>
              
              {/* 아이콘 (좌측 상단) */}
              <div className="relative z-10 mb-4">
                <div className={`inline-flex rounded-xl ${item.bg} p-2.5 ring-1 ${item.border} transition-transform duration-300 group-hover:scale-105`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>

              {/* 텍스트 (좌측 하단) */}
              <div className="relative z-10">
                <h2 className="text-lg font-bold text-gray-100 transition-colors group-hover:text-white mb-1 tracking-tight">{item.name}</h2>
                <p className="text-xs text-gray-400 transition-colors group-hover:text-gray-300 line-clamp-2 min-h-[2.5em] leading-relaxed">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
