import { vocaloidEventLists } from "@/data/vocaloidEventLists";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getTodayInKST, formatDateForDateObject } from "@/lib/dateUtils";

export function EventSchedule() {
    const today = getTodayInKST();

    const upcomingEvents = vocaloidEventLists
        .filter(event => {
            const endDate = event.eventEndDate ? new Date(formatDateForDateObject(event.eventEndDate)) : new Date(formatDateForDateObject(event.eventStartDate));
            // Set time to the end of the day for accurate comparison
            endDate.setHours(23, 59, 59, 999);
            return endDate >= today;
        })
        .sort((a, b) => {
            const dateA = new Date(formatDateForDateObject(a.eventStartDate));
            const dateB = new Date(formatDateForDateObject(b.eventStartDate));
            return dateA.getTime() - dateB.getTime();
        });

    const displayedEvents = upcomingEvents.slice(0, 5);

    return (
        <div className="text-white">
            <div className="relative pl-6 md:pl-0">
                {/* Timeline Line */}
                <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-white/10 md:left-1/2 md:-translate-x-1/2"></div>

                {/* Event Items */}
                <ul className="space-y-12">
                    {displayedEvents.map((event, index) => {
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
                            } else {
                                status = `D-${diffDays}`;
                                statusColor = "text-cyan-400";
                            }
                        }

                        const dateDisplay = endDate ? `${event.eventStartDate} ~ ${event.eventEndDate}` : event.eventStartDate;

                        return (
                            <li key={event.eventName} className="relative">
                                {/* Timeline Marker */}
                                <div className="absolute -left-8 top-1 h-4 w-4 rounded-full bg-cyan-400 border-4 border-gray-900 md:left-1/2 md:-translate-x-1/2"></div>

                                {/* Card */}
                                <div
                                    className={`w-full rounded-lg bg-white/5 p-4 shadow-lg ring-1 ring-white/10 transition-transform duration-300 hover:scale-105 hover:ring-white/20 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:text-right md:pr-8'}`}>
                                    <div className={`flex items-center gap-2 font-bold ${statusColor} ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                                        <Calendar size={16}/>
                                        <span>{dateDisplay}</span>
                                    </div>
                                    <h3 className="mt-2 text-lg font-semibold text-white">{event.eventName}</h3>
                                    <div className={`mt-3 flex items-center gap-4 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                                        <span className={`font-bold text-lg ${statusColor}`}>{status}</span>
                                        {event.eventSite && (
                                            <a href={event.eventSite} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/10">
                                                <ExternalLink size={14}/>
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

            <div className="flex justify-center mt-12">
                <Link href="/event"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20">
                    <span>전체 이벤트 보기</span>
                    <ArrowRight size={20}/>
                </Link>
            </div>
        </div>
    );
}
