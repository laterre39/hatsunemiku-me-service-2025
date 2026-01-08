import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-white/5 p-6 ring-1 ring-white/10">
        <FileQuestion className="h-16 w-16 text-gray-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">페이지를 찾을 수 없습니다</h1>
      <p className="mb-8 text-gray-400">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.<br />
        입력하신 주소가 정확한지 다시 한번 확인해주세요.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl bg-[#39C5BB] px-6 py-3 font-bold text-white transition-colors hover:bg-[#2fa098]"
      >
        <Home size={18} />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
