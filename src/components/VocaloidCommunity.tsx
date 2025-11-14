import { vocaloidCommunityLists } from "@/data/vocaloidCommunityLists";
import { Music, ExternalLink } from "lucide-react";

export function VocaloidCommunity() {
    return (
        <div className="text-white">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {vocaloidCommunityLists.map((community) => (
                    <div
                        key={community.name}
                        className="group relative flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 ease-in-out hover:border-cyan-400/30 hover:bg-white/10"
                    >
                        <div className="flex-grow">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-cyan-400/10 p-2 ring-1 ring-cyan-400/20">
                                    <Music className="h-6 w-6 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100">{community.name}</h3>
                            </div>
                            <p className="mt-4 text-sm text-slate-400">{community.description}</p>
                        </div>
                        <div className="mt-6">
                            <a
                                href={community.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-700/50 px-4 py-2 text-sm font-semibold text-cyan-400 ring-1 ring-slate-600 transition-colors hover:bg-slate-700"
                            >
                                <ExternalLink size={16} />
                                <span>바로가기</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
