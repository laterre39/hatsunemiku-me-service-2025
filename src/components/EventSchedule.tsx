import {vocaloidEventLists} from "@/data/vocaloidEventLists";
import {ExternalLink} from "lucide-react";

const formatDateForDateObject = (dateStr: string) => dateStr.replace(/\./g, '-');

const getEventDuration = (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export function EventSchedule() {
    return (
        <div className="text-white">
            <ul className="space-y-4">
                {vocaloidEventLists.map((event) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Normalize today's date to the beginning of the day

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
                            <div>
                                <p className="font-semibold text-base md:text-lg">{event.eventName}</p>
                                <p className="flex items-center text-sm md:text-base font-medium text-cyan-400 mt-1">
                                    {dateDisplay}
                                </p>
                            </div>

                            <div className="justify-self-end">
                                {status}
                            </div>

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
        </div>
    );
}
