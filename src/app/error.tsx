"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/20">
        <AlertTriangle className="h-16 w-16 text-red-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">오류가 발생했습니다</h1>
      <p className="mb-8 text-gray-400">
        서비스 이용 중 예상치 못한 문제가 발생했습니다.<br />
        잠시 후 다시 시도해주세요.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
        >
          <RefreshCcw size={18} />
          다시 시도
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[#39C5BB] px-6 py-3 font-bold text-white transition-colors hover:bg-[#2fa098]"
        >
          <Home size={18} />
          홈으로
        </Link>
      </div>
    </div>
  );
}
