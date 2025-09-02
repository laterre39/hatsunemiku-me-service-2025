'use client';

import {useEffect, useRef, useState} from "react";
import {GalleryItem, galleryItems} from "@/data/galleryItems";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft, ArrowRight, ExternalLink, User, X} from "lucide-react";

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

            {/* Image Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row overflow-hidden animate-slide-up relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                        >
                            <X size={24}/>
                        </button>

                        <div className="lg:w-3/5 flex items-center justify-center bg-black/30 p-4">
                            <Image
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                width={1600}
                                height={1200}
                                className="w-auto h-auto max-w-full max-h-[55vh] lg:max-h-[calc(90vh-2rem)] object-contain rounded-lg shadow-2xl shadow-cyan-500/10"
                            />
                        </div>

                        <div className="lg:w-2/5 p-6 flex flex-col bg-black/20">
                            <div className="flex-grow overflow-y-auto">
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
                                <div className="flex items-center gap-4 mb-4">
                                    <Link href={selectedItem.artistUrl} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-lg text-gray-300 hover:text-cyan-400 transition-colors">
                                        <User size={20}/>
                                        <span>{selectedItem.artist}</span>
                                    </Link>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    {selectedItem.content || '이 공간을 활용하여 이미지에 대한 추가 설명을 넣을 수 있습니다. 예를 들어, 작품에 대한 이야기나 사용된 도구, 제작 과정 등을 자유롭게 서술해 보세요.'}
                                </p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <Link href={selectedItem.sourceUrl} target="_blank" rel="noopener noreferrer"
                                          className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors">
                                        <ExternalLink size={18}/>
                                        <span>원본 게시물 보기</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
