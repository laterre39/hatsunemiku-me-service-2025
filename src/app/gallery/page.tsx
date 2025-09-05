'use client';

import {useEffect, useRef, useState} from "react";
import {GalleryItem, galleryItems} from "@/data/galleryItems";
import Image from "next/image";
import Link from "next/link";
import {ExternalLink, User, X} from "lucide-react";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const mainRef = useRef<HTMLElement>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (mainRef.current) {
            mainRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [currentPage]);

    // Add keyboard support for closing the modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedItem(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


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
                    <div key={item.id}
                         onClick={() => setSelectedItem(item)}
                         className="break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={500}
                            height={500}
                            className="h-auto w-full transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <Link href={item.artistUrl} target="_blank" rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors mt-1">
                                    <User size={14}/>
                                    <span>{item.artist}</span>
                                </Link>
                            </div>
                            <Link href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute top-3 right-3 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors">
                                <ExternalLink size={18}/>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Image Modal - Scroll Fixed Design */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. Image Area (Non-scrolling) */}
                        <div className="p-6 pb-0 flex-shrink-0">
                            <Image
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                width={1000}
                                height={1000}
                                className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
                            />
                        </div>

                        {/* 2. Content Area (Scrollable) */}
                        <div className="overflow-y-auto p-6 flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white tracking-wide">{selectedItem.title}</h2>
                                    <Link href={selectedItem.artistUrl} target="_blank" rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-gray-200 hover:text-cyan-400 transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                                        <User size={16}/>
                                        <span>{selectedItem.artist}</span>
                                    </Link>
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    {selectedItem.content || '이 이미지에 대한 설명이 아직 없습니다. 원본 게시물에서 자세한 내용을 확인해보세요.'}
                                </p>
                            </div>
                        </div>

                        {/* 3. Button Area (Non-scrolling) */}
                        <div className="p-6 pt-0 flex-shrink-0">
                            <Link href={selectedItem.sourceUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition-colors">
                                <ExternalLink size={18}/>
                                <span>원본 게시물 보기</span>
                            </Link>
                        </div>

                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
                        >
                            <X size={24}/>
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
