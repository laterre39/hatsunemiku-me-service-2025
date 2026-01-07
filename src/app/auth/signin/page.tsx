"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { FaGoogle } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import { LockKeyhole } from "lucide-react";

function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[url('/main_bg.png')] bg-repeat">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#39C5BB]"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/main_bg.png')] bg-repeat px-4">
      {/* Aurora Background */}
      <div className="absolute -top-1/2 left-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle_at_center,_rgba(57,197,187,0.2)_0,_rgba(57,197,187,0)_50%)]"></div>

      <div className="w-full max-w-md animate-[fade-in-up_0.8s_ease-out] rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#39C5BB]/10 ring-1 ring-[#39C5BB]/30">
            <LockKeyhole className="h-8 w-8 text-[#39C5BB]" />
          </div>
          <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
          <p className="mt-2 text-sm text-gray-400">
            서비스 관리를 위해 로그인이 필요합니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-4 py-3.5 font-semibold text-gray-800 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <FaGoogle className="relative z-10 text-xl text-red-500 transition-transform group-hover:scale-110" />
            <span className="relative z-10">Google 계정으로 계속하기</span>
          </button>

          <button
            onClick={() => signIn("naver", { callbackUrl })}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#03C75A] px-4 py-3.5 font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#03C75A] to-[#02b351] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <SiNaver className="relative z-10 text-xl transition-transform group-hover:scale-110" />
            <span className="relative z-10">네이버 계정으로 계속하기</span>
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} HatsuneMiku.me Admin
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[url('/main_bg.png')] bg-repeat">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#39C5BB]"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
