import {FaSpotify, FaYoutube} from "react-icons/fa6";
import {YouTubeRanking} from "@/components/YouTubeRanking";
import {SpotifyRanking} from "@/components/SpotifyRanking";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

export function RankingComponent() {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div
                        className="flex items-center justify-end bg-white/5 rounded-lg hover:bg-white/10 hover:shadow-md p-2 gap-2 mb-4">
                        <h3 className="font-semibold text-xl text-white">YouTube</h3>
                        <FaYoutube size={28} className="text-red-500"/>
                    </div>
                    <YouTubeRanking/>
                </div>
                <div>
                    <div
                        className="flex items-center justify-end bg-white/5 rounded-lg hover:bg-white/10 hover:shadow-md p-2 gap-2 mb-4">
                        <h3 className="font-semibold text-xl text-white">Spotify</h3>
                        <FaSpotify size={28} className="text-green-500"/>
                    </div>
                    <SpotifyRanking/>
                </div>
            </div>
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