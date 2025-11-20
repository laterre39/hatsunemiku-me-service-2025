'use client';

import React, { useState } from 'react';
import { vocaloidBirthdays } from '@/data/vocaloidBirthdayLists';
import { linkedSites } from "@/data/linkedSites";
import { Calendar, ExternalLink, Send, ArrowRight } from "lucide-react";
import { LinkedSiteCard } from './LinkedSiteCard';
import { BirthdayListItem, VocaloidBirthday } from './BirthdayListItem';

export function Footer() {
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
    const [isLinkedSitesModalOpen, setIsLinkedSitesModalOpen] = useState(false);

    const getTodayKST = () => {
        const now = new Date();
        const kstDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
        return new Date(kstDateString + 'T00:00:00Z');
    };

    const today = getTodayKST();
    const currentYear = today.getUTCFullYear();

    const sortedBirthdays: VocaloidBirthday[] = vocaloidBirthdays.map(vocaloid => {
        const birthdayThisYear = new Date(Date.UTC(currentYear, vocaloid.month - 1, vocaloid.day));
        const diffDays = Math.round((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let isHighlight = false;
        let sortKey: number;
        let dDayText = '';

        if (diffDays === 0) {
            isHighlight = true;
            sortKey = -Infinity;
        } else {
            let upcomingDDay = diffDays;
            if (diffDays < 0) {
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
    }).toSorted((a, b) => a.sortKey - b.sortKey);

    const sitesForFooter = linkedSites.filter(site => site.showInFooter);

    return (
        <footer className="border-t border-gray-200/80 bg-white mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap items-start justify-center gap-8">
                    {/* Creator Info */}
                    <div className="w-sm">
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold text-gray-800">Created by MIKUMIKU</h4>
                            <div className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <p>하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span className="font-bold text-[#39C5BB]">미쿠 사랑해</span>🩵</p>
                            <p>사이트 관련 문의 및 <span className="font-bold text-[#39C5BB]">편집자 지원</span>은 아래 메일로 부탁드립니다.</p>
                            <p className="font-bold text-[#39C5BB]">미쿠미쿠하게 해줄게 ♪</p>
                            <a href="mailto:contact@hatsunemiku.me"
                               className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-150 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md">
                                <Send size={16}/>
                                문의하기
                            </a>
                        </div>
                    </div>

                    {/* Vocaloid Birthdays */}
                    <div className="w-sm flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold text-gray-800">Vocaloid Birthdays</h4>
                            <div className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
                        </div>
                        <ul className="grid grid-cols-[auto_1fr] gap-y-1 flex-grow">
                            {sortedBirthdays.slice(0, 5).map((vocaloid) => (
                                <BirthdayListItem key={vocaloid.name} vocaloid={vocaloid} />
                            ))}
                        </ul>
                        {sortedBirthdays.length > 5 && (
                            <button onClick={() => setIsBirthdayModalOpen(true)}
                                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-150 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md">
                                <span>더보기</span>
                                <ArrowRight size={16}/>
                            </button>
                        )}
                    </div>

                    {/* Vocaloid Sites */}
                    <div className="w-sm flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold text-gray-800">Vocaloid Sites</h4>
                            <div className="mt-2 h-1 w-18 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
                        </div>
                        <ul className="grid grid-cols-2 gap-3 flex-grow">
                            {sitesForFooter.map((site) => (
                                <li key={site.name}><LinkedSiteCard site={site}/></li>
                            ))}
                        </ul>
                        {linkedSites.length > sitesForFooter.length && (
                            <button onClick={() => setIsLinkedSitesModalOpen(true)}
                                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-150 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md">
                                <span>더보기</span>
                                <ArrowRight size={16}/>
                            </button>
                        )}
                    </div>
                </div>

              {/* Copyright */}
              <div className="mt-12 border-t border-gray-200/80 pt-8 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  &copy; {new Date().getFullYear()} HatsuneMiku.me
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  This is a non-commercial fan-made website. All characters, music, and other trademarks/copyrights
                  are the property of their respective owners, including Crypton Future Media, INC.
                </p>
              </div>
            </div>

            {/* Vocaloid Birthday Modal */}
            {isBirthdayModalOpen && (
                <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0">
                            <Calendar className="text-[#39C5BB]"/> 보컬로이드 생일
                        </h3>
                        <div className="overflow-y-auto max-h-96">
                            <ul className="grid grid-cols-[auto_1fr] gap-y-1 pr-4">
                                {sortedBirthdays.map((vocaloid) => (
                                    <BirthdayListItem key={vocaloid.name} vocaloid={vocaloid} />
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
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0">
                            <ExternalLink className="text-[#39C5BB]"/> 보컬로이드 사이트
                        </h3>
                        <div className="overflow-y-auto max-h-96">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
                                {linkedSites.map((site) => (
                                    <li key={site.name}><LinkedSiteCard site={site}/></li>
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
