"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Home, Mail } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let title = "로그인 오류";
  let message = "로그인 중 알 수 없는 오류가 발생했습니다.";

  if (error === "AccessDenied") {
    title = "접근이 거부되었습니다";
    message = "등록되지 않은 이메일입니다.\n관리자에게 등록을 요청해주세요.";
  } else if (error === "Configuration") {
    title = "설정 오류";
    message = "서버 설정에 문제가 있습니다. 관리자에게 문의해주세요.";
  } else if (error === "Verification") {
    title = "인증 오류";
    message = "인증 링크가 만료되었거나 이미 사용되었습니다.";
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/20">
        <AlertCircle className="h-16 w-16 text-red-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
      <p className="mb-8 whitespace-pre-line text-gray-400">{message}</p>
      
      <div className="flex gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
        >
          <Home size={18} />
          홈으로
        </Link>
        <a
          href="mailto:contact@hatsunemiku.me"
          className="flex items-center gap-2 rounded-xl bg-[#39C5BB] px-6 py-3 font-bold text-white transition-colors hover:bg-[#2fa098]"
        >
          <Mail size={18} />
          문의하기
        </a>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
