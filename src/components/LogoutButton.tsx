"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, X } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, iconSize = 16, children }: LogoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        <LogOut size={iconSize} />
        {children || "로그아웃"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">로그아웃</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-300 mb-8">
              정말로 로그아웃 하시겠습니까?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500/10 px-6 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
