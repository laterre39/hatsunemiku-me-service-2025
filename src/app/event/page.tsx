"use client";

import {useState} from "react";
import {vocaloidEventLists} from "@/data/vocaloidEventLists";
import {ArrowLeft, ArrowRight, ExternalLink} from "lucide-react";

// Helper function to format date strings for the Date constructor
const formatDateForDateObject = (dateStr: string) => dateStr.replace(/\./g, '-');

// Helper function to calculate the duration of the event in days
const getEventDuration = (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const ITEMS_PER_PAGE = 12;

export default function EventPage() {
    const [currentPage, setCurrentPage] = useState(1);

    // Sort all events by date, with upcoming events first, then past events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedEvents = [...vocaloidEventLists].sort((a, b) => {
        const dateA = new Date(formatDateForDateObject(a.eventStartDate));
        const dateB = new Date(formatDateForDateObject(b.eventStartDate));
        const aIsPast = (a.eventEndDate ? new Date(formatDateForDateObject(a.eventEndDate)) : dateA) < today;
        const bIsPast = (b.eventEndDate ? new Date(formatDateForDateObject(b.eventEndDate)) : dateB) < today;

        if (aIsPast && !bIsPast) return 1; // Past events go to the end
        if (!aIsPast && bIsPast) return -1; // Upcoming events come first

        // If both are upcoming or both are past, sort by date
        return dateA.getTime() - dateB.getTime();
    });

    const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <main className="mx-auto max-w-4xl py-12 px-4 text-gray-300">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 이벤트</h1>
                <p className="text-lg">해당 년도에 주최되는 하츠네 미쿠 및 보컬로이드 관련 전체 이벤트 목록입니다.</p>
            </div>

            <div className="text-white">
                <ul className="space-y-4">
                    {displayedEvents.map((event) => {
                        const startDate = new Date(formatDateForDateObject(event.eventStartDate));
                        const endDate = event.eventEndDate ? new Date(formatDateForDateObject(event.eventEndDate)) : null;

                        let status;
                        const isEventFinished = endDate ? today > endDate : today > startDate;
                        const isEventOngoing = endDate && today >= startDate && today <= endDate;

                        if (isEventFinished) {
                            status = <span className="font-bold text-gray-500">종료</span>;
                        } else if (isEventOngoing) {
                            status = <span className="font-bold text-cyan-400">진행 중</span>;
                        } else {
                            const diffTime = startDate.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays === 0) {
                                status = <span className="font-bold text-cyan-400">D-DAY</span>;
                            } else {
                                status = <span className="font-bold text-cyan-400">{`D-${diffDays}`}</span>;
                            }
                        }
                        
                        let dateDisplay;
                        if (endDate) {
                            const duration = getEventDuration(startDate, endDate);
                            dateDisplay = (
                                <>
                                    <span>{`${event.eventStartDate} ~ ${event.eventEndDate}`}</span>
                                    <span className="ml-2 inline-block rounded bg-cyan-400/20 px-2 py-1 text-xs font-semibold text-cyan-300">
                                        {duration}일간
                                    </span>
                                </>
                            );
                        } else {
                            dateDisplay = event.eventStartDate;
                        }

                        return (
                            <li key={event.eventName} className="bg-white/5 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Left side on desktop, top on mobile */}
                                <div>
                                    <p className="font-semibold text-base md:text-lg">{event.eventName}</p>
                                    <p className="flex items-center text-sm md:text-base font-medium text-cyan-400 mt-1">{dateDisplay}</p>
                                </div>
                                
                                {/* Right side on desktop, bottom on mobile (aligned right) */}
                                <div className="flex items-center justify-end gap-4 self-end md:self-auto md:gap-6">
                                    <div className="font-bold">
                                        {status}
                                    </div>
                                    <div>
                                        {event.eventSite && (
                                            <a href={event.eventSite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded border-2 border-[#39C5BB] px-3 py-2 text-xs md:text-sm font-semibold text-[#39C5BB] transition-colors hover:bg-[#39C5BB] hover:text-white">
                                                <ExternalLink size={16} />
                                                <span>공식 사이트</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={16} />
                    <span>이전</span>
                </button>

                <span className="font-semibold text-white">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>다음</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </main>
    );
}
