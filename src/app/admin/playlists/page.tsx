import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PlaylistManagementClient from "@/components/PlaylistManagementClient";
import { ListMusic, ArrowLeft, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AccessDenied from "@/components/AccessDenied";

export default async function PlaylistManagementPage() {
  const session = await getServerSession(authOptions);

  // ADMIN 또는 STAFF 권한 체크
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    if (!session) {
      redirect("/auth/signin?callbackUrl=/admin/playlists");
    }
    return <AccessDenied />;
  }

  const playlists = await prisma.vocaPlaylist.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                <LayoutDashboard size={14} />
                관리자 대시보드
              </Link>
              <ChevronRight size={14} />
              <span className="text-[#39C5BB]">플레이리스트 관리</span>
            </div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <ListMusic className="text-green-400" />
              플레이리스트 관리
            </h1>
            <p className="mt-2 text-gray-400">유튜브/스포티파이 플리 관리</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              뒤로가기
            </Link>
            <LogoutButton className="group inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300" iconSize={16} />
          </div>
        </header>

        <PlaylistManagementClient initialPlaylists={playlists} />
      </div>
    </div>
  );
}
