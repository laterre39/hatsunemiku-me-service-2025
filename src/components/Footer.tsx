'use client';

import React, {useState} from 'react';
import {vocaloidBirthdays} from '@/data/vocaloidBirthdayLists';
import {linkedSites} from "@/data/linkedSites";
import {
  AudioLines,
  Calendar,
  ExternalLink,
  Send,
} from "lucide-react";
import {FaCompactDisc, FaFacebook, FaSquareInstagram, FaSquareXTwitter} from "react-icons/fa6";

interface IconProps {
  size?: number;
  className?: string;
}

const iconMap: { [key: string]: React.ComponentType<IconProps> } = {
  "Official Blog": AudioLines,
  "Official X": FaSquareXTwitter,
  "Official Facebook": FaFacebook,
  "Official Instagram": FaSquareInstagram,
  "KARENT Music": FaCompactDisc,
  "K!!te": FaCompactDisc,
};

const LinkedSiteCard = ({site}: { site: { name: string, url: string } }) => {
  const Icon = iconMap[site.name] || ExternalLink;
  return (
      <a href={site.url} target="_blank" rel="noopener noreferrer"
         className="group flex items-center gap-3 rounded-lg p-3 bg-gray-100 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-lg">
        <Icon size={22} className="text-gray-500 transition-colors group-hover:text-cyan-500"/>
        <span
            className="font-semibold text-sm text-gray-700 transition-colors group-hover:text-cyan-600">{site.name}</span>
      </a>
  );
};

export function Footer() {
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isLinkedSitesModalOpen, setIsLinkedSitesModalOpen] = useState(false);

  const getTodayKST = () => {
    const now = new Date();
    const kstDateString = now.toLocaleDateString('en-CA', {timeZone: 'Asia/Seoul'});
    return new Date(kstDateString + 'T00:00:00Z');
  };

  const today = getTodayKST();
  const currentYear = today.getUTCFullYear();

  const processedBirthdays = vocaloidBirthdays.map(vocaloid => {
    const birthdayThisYear = new Date(Date.UTC(currentYear, vocaloid.month - 1, vocaloid.day));
    const diffDays = Math.round((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let isHighlight = false;
    let sortKey: number;
    let dDayText = '';

    if (diffDays === 0) {
      isHighlight = true;
      sortKey = -Infinity; // 생일 당일인 경우 최상단에 고정
    } else {
      let upcomingDDay = diffDays;
      if (diffDays < 0) { // 이미 지난 생일
        const birthdayNextYear = new Date(Date.UTC(currentYear + 1, vocaloid.month - 1, vocaloid.day));
        upcomingDDay = Math.round((birthdayNextYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
      dDayText = `D-${upcomingDDay}`;
      sortKey = upcomingDDay;
    }

    return {
      ...vocaloid,
      dDayText,
      isHighlight,
      sortKey,
      anniversary: currentYear - vocaloid.year
    };
  });

  const sortedBirthdays = processedBirthdays.toSorted((a, b) => a.sortKey - b.sortKey);
  const sitesForFooter = linkedSites.filter(site => site.showInFooter);

  return (
      <footer className="border-t border-gray-200/80 bg-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-start justify-center gap-8">
            {/* Creator Info */}
            <div className="w-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold text-gray-800">Created by MIKUMIKU</h4>
                </div>
                <div
                    className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span
                    className="font-bold text-[#39C5BB]">미쿠 사랑해</span>🩵 사이트 관련
                  문의는 하단의 메일로 문의 부탁드립니다. </p>
                <p>사이트 운영을 위한 <span className="font-bold text-[#39C5BB]">편집자</span>를 모집하고 있습니다. 관련
                  문의도 하단의 <span className="font-bold">메일로 문의</span>를 부탁드립니다.</p>
                <p className="font-bold text-[#39C5BB]">미쿠미쿠하게 해줄게 ♪</p>
                <a href="mailto:contact@hatsunemiku.me"
                   className="flex items-center gap-1 font-semibold text-gray-600 hover:text-[#39C5BB]">
                  <Send size={18}/>
                  Send Mail
                </a>
              </div>
            </div>

            {/* Vocaloid Birthdays */}
            <div className="w-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold text-gray-800">Vocaloid Birthdays</h4>
                </div>
                <div
                    className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
              </div>
              <ul className="grid grid-cols-[auto_1fr] gap-y-1">
                {sortedBirthdays.slice(0, 5).map((vocaloid) => (
                    <li key={vocaloid.name}
                        className={`col-span-2 grid grid-cols-subgrid items-center rounded-md px-2 py-1 transition-colors duration-300`}
                        style={vocaloid.isHighlight ? {
                          backgroundColor: `${vocaloid.color}20`,
                          borderLeft: `4px solid ${vocaloid.color}`
                        } : {}}
                    >
                                    <span
                                        className={`font-semibold ${!vocaloid.isHighlight ? 'underline underline-offset-4 decoration-4' : ''}`}
                                        style={!vocaloid.isHighlight ? {
                                          color: vocaloid.color,
                                          textDecorationColor: vocaloid.color
                                        } : {color: vocaloid.color}}
                                    >
                                        {vocaloid.name}
                                    </span>
                      <div
                          className="justify-self-end flex items-center gap-2 font-bold text-gray-700">
                        {vocaloid.isHighlight ? (
                            <span className="text-white font-bold px-2.5 py-1 rounded-full text-sm"
                                  style={{backgroundColor: vocaloid.color}}>{vocaloid.anniversary}th Anniversary</span>

                        ) : (
                            <span className="tabular-nums">{vocaloid.dDayText}</span>
                        )}
                      </div>
                    </li>
                ))}
              </ul>
              {sortedBirthdays.length > 5 && (
                  <button onClick={() => setIsBirthdayModalOpen(true)}
                          className="flex items-center gap-1 pt-2 font-bold text-gray-600 hover:text-[#39C5BB]">
                    <ExternalLink size={18}/>
                    더보기
                  </button>
              )}
            </div>

            {/* Vocaloid Sites */}
            <div className="w-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold text-gray-800">Vocaloid Sites</h4>
                </div>
                <div
                    className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {sitesForFooter.map((site) => (
                    <li key={site.name}>
                      <LinkedSiteCard site={site}/>
                    </li>
                ))}
              </ul>
              {linkedSites.length > sitesForFooter.length && (
                  <button onClick={() => setIsLinkedSitesModalOpen(true)}
                          className="flex items-center gap-1 pt-2 font-bold text-gray-600 hover:text-[#39C5BB]">
                    <ExternalLink size={18}/>
                    더보기
                  </button>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm text-gray-600">
            <p className="font-semibold">&copy; {new Date().getFullYear()} HatsuneMiku.me</p>
            <p className="mt-2 font-light">This is a non-commercial fan-made website.</p>
            <p className="font-light">
              Hatsune Miku and other VOCALOID characters are trademarks and copyrights of Crypton
              Future
              Media, INC. and their respective owners.
            </p>
          </div>
        </div>

        {/* Vocaloid Birthday Modal */}
        {isBirthdayModalOpen && (
            <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50">
              <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0">
                  <Calendar className="text-black"/>
                  Vocaloid Birthdays</h3>
                <div className="overflow-y-auto max-h-96">
                  <ul className="grid grid-cols-[auto_1fr] gap-y-1 pr-4">
                    {sortedBirthdays.map((vocaloid) => (
                        <li key={vocaloid.name}
                            className={`col-span-2 grid grid-cols-subgrid items-center rounded-md px-2 py-1 transition-colors duration-300`}
                            style={vocaloid.isHighlight ? {
                              backgroundColor: `${vocaloid.color}20`,
                              borderLeft: `4px solid ${vocaloid.color}`
                            } : {}}
                        >
                                        <span
                                            className={`font-semibold ${!vocaloid.isHighlight ? 'underline underline-offset-4 decoration-4' : ''}`}
                                            style={!vocaloid.isHighlight ? {
                                              color: vocaloid.color,
                                              textDecorationColor: vocaloid.color
                                            } : {color: vocaloid.color}}
                                        >
                                            {vocaloid.name}
                                        </span>
                          <div
                              className="justify-self-end flex items-center gap-2 font-bold text-gray-700">
                            {vocaloid.isHighlight ? (
                                <span
                                    className="text-white font-bold px-2.5 py-1 rounded-full text-sm"
                                    style={{backgroundColor: vocaloid.color}}>{vocaloid.anniversary}th Anniversary</span>
                            ) : (
                                <span className="tabular-nums">{vocaloid.dDayText}</span>
                            )}
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => setIsBirthdayModalOpen(false)}
                        className="mt-6 px-4 py-2 bg-[#39C5BB] text-white rounded-md hover:bg-[#2fa098] transition-colors duration-200 w-full flex-shrink-0">
                  닫기
                </button>
              </div>
            </div>
        )}

        {/* Vocaloid Sites Modal */}
        {isLinkedSitesModalOpen && (
            <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50">
              <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0">
                  <ExternalLink className="text-black"/>
                  Vocaloid Sites</h3>
                <div className="overflow-y-auto max-h-96">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
                    {linkedSites.map((site) => (
                        <li key={site.name}>
                          <LinkedSiteCard site={site}/>
                        </li>

                    ))}
                  </ul>
                </div>
                <button onClick={() => setIsLinkedSitesModalOpen(false)}
                        className="mt-6 px-4 py-2 bg-[#39C5BB] text-white rounded-md hover:bg-[#2fa098] transition-colors duration-200 w-full flex-shrink-0">
                  닫기
                </button>
              </div>
            </div>
        )}
      </footer>
  );
}
