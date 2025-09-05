'use client';

import {useCallback, useEffect, useRef, useState} from "react";
import {GalleryItem, galleryItems} from "@/data/galleryItems";
import Image from "next/image";
import Link from "next/link";
import {ExternalLink, User, X, ChevronLeft, ChevronRight} from "lucide-react";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const mainRef = useRef<HTMLElement>(null);
    const isInitialMount = useRef(true);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);

    const handleNext = useCallback(() => {
        setSelectedItem(prev => {
            if (!prev) return null;
            const currentIndex = galleryItems.findIndex(item => item.id === prev.id);
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            return galleryItems[nextIndex];
        });
    }, []);

    const handlePrevious = useCallback(() => {
        setSelectedItem(prev => {
            if (!prev) return null;
            const currentIndex = galleryItems.findIndex(item => item.id === prev.id);
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            return galleryItems[prevIndex];
        });
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (mainRef.current) {
            mainRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [currentPage]);

    // Effect to programmatically open/close the dialog
    useEffect(() => {
        const dialog = dialogRef.current;
        if (selectedItem && dialog && !dialog.open) {
            dialog.showModal();
        } else if (!selectedItem && dialog?.open) {
            dialog.close();
        }
    }, [selectedItem]);

    // Effect for keyboard navigation (arrows)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!selectedItem) return;

            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, handleNext, handlePrevious]);

    // Effect to manage focus within the modal on navigation
    useEffect(() => {
        if (selectedItem && modalContentRef.current) {
            // Use a timeout to ensure focus is set after the re-render is complete
            const timer = setTimeout(() => {
                modalContentRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedItem]);


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
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        aria-label={`${item.title} 이미지 보기`}
                        className="bg-transparent border-none p-0 text-left w-full break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={500}
                            height={500}
                            className="h-auto w-full transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-hidden="true"
                        >
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <div className="flex items-center gap-1.5 text-sm text-gray-300 mt-1">
                                    <User size={14}/>
                                    <span>{item.artist}</span>
                                </div>
                            </div>
                            <div
                                className="absolute top-3 right-3 p-2 rounded-full bg-white/30">
                                <ExternalLink size={18}/>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <dialog
                ref={dialogRef}
                onClose={() => setSelectedItem(null)}
                className="p-0 m-auto bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-lg"
            >
                {selectedItem && (
                    <div ref={modalContentRef} tabIndex={-1} className="relative outline-none">
                        <button
                            onClick={handlePrevious}
                            aria-label="이전 이미지"
                            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                            <ChevronLeft size={32}/>
                        </button>

                        <button
                            onClick={handleNext}
                            aria-label="다음 이미지"
                            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                            <ChevronRight size={32}/>
                        </button>

                        <div
                            className="bg-gray-800/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
                        >
                            <div className="p-6 pb-0 flex-shrink-0">
                                <Image
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title}
                                    width={1000}
                                    height={1000}
                                    className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
                                />
                            </div>

                            <div
                                className="overflow-y-auto p-6 flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h2 id="modal-title" className="text-3xl font-bold text-white tracking-wide">{selectedItem.title}</h2>
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

                            <div className="p-6 pt-0 flex-shrink-0 grid grid-cols-2 gap-4">
                                <Link href={selectedItem.sourceUrl} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                                    <ExternalLink size={18}/>
                                    <span>원본 보기</span>
                                </Link>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-600 text-white font-bold hover:bg-gray-700 transition-colors">
                                    <X size={18}/>
                                    <span>닫기</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </dialog>
        </main>
    );
}
