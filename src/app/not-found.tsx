'use client';

import Link from 'next/link';
import {Unplug, Home} from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center text-white">
            <div className="rounded-2xl bg-white/5 p-8 md:p-12 border border-white/10 shadow-2xl backdrop-blur-lg">
                <div className="flex justify-center">
                    <Unplug className="h-16 w-16 text-cyan-400"/>
                </div>
                <h1 className="mt-8 text-8xl font-black text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.3)]">
                    404
                </h1>
                <p className="mt-4 text-2xl font-semibold text-gray-200">
                    페이지를 찾을 수 없습니다.
                </p>
                <p className="mt-3 text-gray-400">
                    요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
                </p>
                <div className="mt-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
                    >
                        <Home size={18}/>
                        <span>홈으로 돌아가기</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
