import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import UserManagementClient from "@/components/UserManagementClient";
import { Users, ArrowLeft, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AccessDenied from "@/components/AccessDenied";

// 이 페이지는 항상 최신 데이터를 불러오도록 설정
export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin/users");
  }

  if (session.user.role !== "ADMIN") {
    return <AccessDenied />;
  }

  // 병렬로 데이터 조회
  const [users, whitelist] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.whiteList.findMany({ orderBy: { id: 'desc' } }),
  ]);

  const serializedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  }));

  return (
    <div className="min-h-screen bg-[url('/main_bg.png')] bg-repeat p-4 sm:p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                <LayoutDashboard size={14} />
                관리자 대시보드
              </Link>
              <ChevronRight size={14} />
              <span className="text-[#39C5BB]">사용자 관리</span>
            </div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Users className="text-orange-400" />
              사용자 관리
            </h1>
            <p className="mt-2 text-gray-400">회원 목록 조회 및 권한 설정</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              뒤로가기
            </Link>
            <LogoutButton className="group inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300" iconSize={16} />
          </div>
        </header>

        <UserManagementClient initialUsers={serializedUsers} initialWhitelist={whitelist} />
      </div>
    </div>
  );
}
