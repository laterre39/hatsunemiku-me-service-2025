"use client";

import {useEffect, useRef, useState} from "react";
import {vocaloidEventLists} from "@/data/vocaloidEventLists";
import {Calendar, ExternalLink} from "lucide-react";
import Pagination from "@/components/Pagination";

// Helper function to format date strings for the Date constructor
const formatDateForDateObject = (dateStr: string) => dateStr.replace(/\./g, '-');

// Helper function to get the current date at midnight KST
const getTodayKST = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(utc + kstOffset);
    kstDate.setUTCHours(0, 0, 0, 0);
    return kstDate;
};

const ITEMS_PER_PAGE = 10; // Adjusted for single-column view

export default function EventPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const mainRef = useRef<HTMLElement>(null);
    const isInitialMount = useRef(true);

    const today = getTodayKST();
    const currentYear = today.getFullYear();

    const sortedEvents = [...vocaloidEventLists].sort((a, b) => {
        const dateA = new Date(formatDateForDateObject(a.eventStartDate));
        const dateB = new Date(formatDateForDateObject(b.eventStartDate));
        const aIsPast = (a.eventEndDate ? new Date(formatDateForDateObject(a.eventEndDate)) : dateA) < today;
        const bIsPast = (b.eventEndDate ? new Date(formatDateForDateObject(b.eventEndDate)) : dateB) < today;

        if (aIsPast && !bIsPast) return 1;
        if (!aIsPast && bIsPast) return -1;

        return dateA.getTime() - dateB.getTime();
    });

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (mainRef.current) {
            mainRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [currentPage]);


    const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <main ref={mainRef} className="mx-auto max-w-4xl py-12 px-4 scroll-mt-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 이벤트</h1>
                <p className="text-lg text-gray-300">{currentYear}년도에 주최되는 보컬로이드 관련 전체 이벤트 목록입니다.</p>
            </div>

            <ul className="space-y-6">
                {displayedEvents.map((event) => {
                    const startDate = new Date(formatDateForDateObject(event.eventStartDate));
                    const endDate = event.eventEndDate ? new Date(formatDateForDateObject(event.eventEndDate)) : null;

                    let status, statusColor;
                    const isEventOngoing = endDate && today >= startDate && today <= endDate;
                    if (isEventOngoing) {
                        status = "진행 중";
                        statusColor = "text-green-400";
                    } else {
                        const diffTime = startDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 0) {
                            status = "D-DAY";
                            statusColor = "text-red-400";
                        } else if (diffDays < 0) {
                            status = "종료";
                            statusColor = "text-gray-500";
                        } else {
                            status = `D-${diffDays}`;
                            statusColor = "text-cyan-400";
                        }
                    }

                    const dateDisplay = endDate ? `${event.eventStartDate} ~ ${event.eventEndDate}` : event.eventStartDate;

                    return (
                        <li key={event.eventName}
                            className="bg-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1">
                            <div>
                                <div className={`flex items-center gap-2 text-sm font-bold ${statusColor}`}>
                                    <Calendar size={14}/>
                                    <span>{dateDisplay}</span>
                                </div>
                                <h3 className="mt-2 text-lg font-semibold text-white">{event.eventName}</h3>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end sm:gap-6 mt-4 sm:mt-0">
                                <span className={`font-bold text-lg ${statusColor}`}>{status}</span>
                                {event.eventSite && (
                                    <a href={event.eventSite} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/10">
                                        <ExternalLink size={14}/>
                                        <span>공식 사이트</span>
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </main>
    );
}
