"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import Pagination from "@/components/Pagination";
import { getTodayInKST } from "@/lib/dateUtils";
import { VocaEvent } from "@/types/event";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

interface EventPageClientProps {
  initialEvents: VocaEvent[];
}

export function EventPageClient({ initialEvents }: EventPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const mainRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);

  const today = getTodayInKST();
  const currentYear = new Date().getFullYear();

  const events = initialEvents.map((e) => ({
    ...e,
    startDate: new Date(e.startDate),
    endDate: new Date(e.endDate),
  }));

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;

    const endDateA = new Date(a.endDate);
    endDateA.setHours(23, 59, 59, 999);
    const aIsPast = endDateA < today;

    const endDateB = new Date(b.endDate);
    endDateB.setHours(23, 59, 59, 999);
    const bIsPast = endDateB < today;

    if (aIsPast && !bIsPast) return 1;
    if (!aIsPast && bIsPast) return -1;

    return dateA.getTime() - dateB.getTime();
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main ref={mainRef} className="mx-auto max-w-4xl py-12 px-4 scroll-mt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">보컬로이드 이벤트</h1>
        <p className="text-lg text-gray-300">
          {currentYear}년도에 주최되는 보컬로이드 관련 전체 이벤트 목록입니다.
        </p>
      </div>

      <ul className="space-y-6">
        {displayedEvents.map((event) => {
          const startDate = event.startDate;
          const endDate = event.endDate;

          const effectiveEndDate = new Date(endDate);
          effectiveEndDate.setHours(23, 59, 59, 999);

          let status, statusColor;
          const isEventOngoing = today >= startDate && today <= effectiveEndDate;

          if (isEventOngoing) {
            status = "진행 중";
            statusColor = "text-green-400";
          } else if (effectiveEndDate < today) {
            status = "종료";
            statusColor = "text-gray-500";
          } else {
            const diffTime = startDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            status = diffDays === 0 ? "D-DAY" : `D-${diffDays}`;
            statusColor = diffDays === 0 ? "text-red-400" : "text-cyan-400";
          }

          const formattedStartDate = format(startDate, "yyyy.MM.dd");
          const formattedEndDate = format(endDate, "yyyy.MM.dd");
          const dateDisplay =
            formattedStartDate === formattedEndDate
              ? formattedStartDate
              : `${formattedStartDate} ~ ${formattedEndDate}`;

          return (
            <li
              key={event.id}
              className="bg-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"
            >
              <div>
                <div className={`flex items-center gap-2 text-sm font-bold ${statusColor}`}>
                  <Calendar size={14} />
                  <span>{dateDisplay}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{event.name}</h3>
                {event.comment && (
                  <p className="mt-1 text-sm text-gray-400">{event.comment}</p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:gap-6 mt-4 sm:mt-0">
                <span className={`font-bold text-lg ${statusColor}`}>{status}</span>
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <ExternalLink size={14} />
                    <span>공식 사이트</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

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
