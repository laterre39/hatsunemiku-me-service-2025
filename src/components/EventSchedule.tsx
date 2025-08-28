import {vocaloidEventLists} from "@/data/vocaloidEventLists";
import {ArrowRight, ExternalLink} from "lucide-react";
import Link from "next/link";

// Helper function to format date strings for the Date constructor
const formatDateForDateObject = (dateStr: string) => dateStr.replace(/\./g, '-');

// Helper function to calculate the duration of the event in days
const getEventDuration = (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    // Add 1 to include both start and end dates in the duration
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export function EventSchedule() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // 1. Filter out past events
    const upcomingEvents = vocaloidEventLists.filter(event => {
        const endDate = event.eventEndDate ? new Date(formatDateForDateObject(event.eventEndDate)) : new Date(formatDateForDateObject(event.eventStartDate));
        return endDate >= today;
    });

    // 2. Sort events by the nearest start date
    upcomingEvents.sort((a, b) => {
        const dateA = new Date(formatDateForDateObject(a.eventStartDate));
        const dateB = new Date(formatDateForDateObject(b.eventStartDate));
        return dateA.getTime() - dateB.getTime();
    });

    // 3. Get only the top 5 events
    const displayedEvents = upcomingEvents.slice(0, 5);

    return (
        <div className="text-white">
            <ul className="space-y-4">
                {displayedEvents.map((event) => {
                    const startDate = new Date(formatDateForDateObject(event.eventStartDate));
                    const endDate = event.eventEndDate ? new Date(formatDateForDateObject(event.eventEndDate)) : null;

                    // --- Status Logic ---
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

                    // --- Date Display Logic ---
                    let dateDisplay;
                    if (endDate) {
                        const duration = getEventDuration(startDate, endDate);
                        dateDisplay = (
                            <>
                                <span>{`${event.eventStartDate} ~ ${event.eventEndDate}`}</span>
                                <span
                                    className="ml-2 inline-block rounded bg-cyan-400/20 px-2 py-1 text-xs font-semibold text-cyan-300">
                                    {duration}일간
                                </span>
                            </>
                        );
                    } else {
                        dateDisplay = event.eventStartDate;
                    }

                    return (
                        <li key={event.eventName}
                            className="bg-white/5 rounded-lg p-4 grid grid-cols-[1fr_auto_auto] items-center gap-4 md:gap-6">
                            {/* Column 1: Event Name and Date */}
                            <div>
                                <p className="font-semibold text-base md:text-lg">{event.eventName}</p>
                                <p className="flex items-center text-sm md:text-base font-medium text-cyan-400 mt-1">
                                    {dateDisplay}
                                </p>
                            </div>

                            {/* Column 2: Status */}
                            <div className="justify-self-end">
                                {status}
                            </div>

                            {/* Column 3: Official Site Button */}
                            <div className="justify-self-end">
                                {event.eventSite && (
                                    <a
                                        href={event.eventSite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded border-2 border-[#39C5BB] px-3 py-2 text-xs md:text-sm font-semibold text-[#39C5BB] transition-colors hover:bg-[#39C5BB] hover:text-white"
                                    >
                                        <ExternalLink size={16}/>
                                        <span>공식 사이트</span>
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="flex justify-end mt-6 text-center">
                <Link href="/event"
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                    <span>전체 이벤트 보기</span>
                    <ArrowRight size={20}/>
                </Link>
            </div>
        </div>
    );
}
