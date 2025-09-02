'use client';

import Link from 'next/link';
import {Coffee} from "lucide-react";

export function BuyMeACoffee() {
    return (
        <div className="group fixed bottom-5 left-5 z-50">
            <Link
                href="https://www.buymeacoffee.com/laterre39"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#39C5BB] text-white shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-xl"
            >
                <Coffee className="h-7 w-7"/>
            </Link>
            <div
                className="absolute left-full top-1/2 ml-4 -translate-y-1/2 scale-0 rounded-lg bg-[#39C5BB] px-3 py-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap"
            >
                미쿠에게 커피 사주기!
            </div>
        </div>
    );
}
