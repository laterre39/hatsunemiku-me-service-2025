"use client";

import { VocaDbRanking } from "@/components/VocaDbRanking";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RankingComponent() {
    return (
        <div>
            <VocaDbRanking/>
            <div className="flex justify-end mt-6 text-center">
                <Link href="/music"
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                    <span>전체 보컬로이드 랭킹 보기</span>
                    <ArrowRight size={20}/>
                </Link>
            </div>
        </div>
    );
}
