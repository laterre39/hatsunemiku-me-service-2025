"use client";

import Link from "next/link";
import { ShieldAlert, Home, LogIn, LogOut } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function AccessDenied() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/20">
        <ShieldAlert className="h-16 w-16 text-red-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">접근 권한이 없습니다</h1>
      <p className="mb-8 text-gray-400">
        이 페이지에 접근할 수 있는 권한이 없습니다.<br />
        관리자 계정으로 로그인하거나 관리자에게 문의해주세요.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
        >
          <Home size={18} />
          홈으로
        </Link>
        
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 rounded-xl bg-red-500/20 px-6 py-3 font-bold text-red-400 transition-colors hover:bg-red-500/30"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 rounded-xl bg-[#39C5BB] px-6 py-3 font-bold text-white transition-colors hover:bg-[#2fa098]"
          >
            <LogIn size={18} />
            로그인
          </button>
        )}
      </div>
    </div>
  );
}
