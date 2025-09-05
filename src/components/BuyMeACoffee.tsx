'use client';

import Link from 'next/link';
import {Coffee} from "lucide-react";
import {useEffect, useState} from "react";

export function BuyMeACoffee() {
    const [isInitiallyExpanded, setIsInitiallyExpanded] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitiallyExpanded(false);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <Link
            href="https://www.buymeacoffee.com/mikumiku"
            target="_blank"
            rel="noopener noreferrer"
            className={`group fixed bottom-5 left-5 z-50 flex h-14 items-center justify-start gap-2 rounded-full bg-[#39C5BB] px-4 text-gray-900 shadow-lg transition-all duration-500 ease-in-out hover:w-48 ${isInitiallyExpanded ? 'w-48' : ''}`}
        >
            <Coffee className="h-7 w-7 flex-shrink-0"/>
            <p
                className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ease-in-out group-hover:max-w-full ${isInitiallyExpanded ? 'max-w-full' : 'max-w-0'}`}>
                <span className="font-bold">개발자</span> 커피 사주기 <br/> <span className="font-bold">미쿠</span>도 <span className="font-bold">좋아해요</span>
            </p>
        </Link>
    );
}
