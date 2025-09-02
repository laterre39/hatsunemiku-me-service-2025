'use client';

import {useEffect, useRef, useState} from "react";
import {galleryItems} from "@/data/galleryItems";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft, ArrowRight, ExternalLink, User} from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const mainRef = useRef<HTMLElement>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (mainRef.current) {
            mainRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [currentPage]);

    const totalPages = Math.ceil(galleryItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedItems = galleryItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <main ref={mainRef} className="mx-auto max-w-7xl py-12 px-4 scroll-mt-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 갤러리</h1>
                <p className="text-lg text-gray-300">보컬로이드 팬 아트를 감상하고, 멋진 아티스트들을 만나보세요.</p>
            </div>

            <div
                className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {displayedItems.map((item) => (
                    <div key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-lg">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={500}
                            height={500} // Height will be adjusted by the browser
                            className="h-auto w-full transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <Link href={item.artistUrl} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors mt-1">
                                    <User size={14}/>
                                    <span>{item.artist}</span>
                                </Link>
                            </div>
                            <Link href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                                  className="absolute top-3 right-3 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors">
                                <ExternalLink size={18}/>
                            </Link>
                        </div>
                    </div>
                ))
                }
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowLeft size={16}/>
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors ${
                                    currentPage === page
                                        ? 'bg-white text-gray-900'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowRight size={16}/>
                    </button>
                </div>
            )}
        </main>
    );
}
