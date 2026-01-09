'use client';

import React, { useState } from 'react';
import { Calendar, ExternalLink, Send, ArrowRight, Heart, Music, Globe, Sparkles } from "lucide-react";
import { LinkedSiteCard } from './LinkedSiteCard';
import { BirthdayListItem, VocaloidBirthday } from './BirthdayListItem';
import { VocaBirthday } from '@/services/birthdayService';
import { VocaSite } from '@/services/siteService';

interface FooterProps {
  birthdays: VocaBirthday[];
  sites: VocaSite[];
}

export function Footer({ birthdays, sites }: FooterProps) {
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
    const [isLinkedSitesModalOpen, setIsLinkedSitesModalOpen] = useState(false);

    const getTodayKST = () => {
        const now = new Date();
        const kstDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
        return new Date(kstDateString + 'T00:00:00Z');
    };

    const today = getTodayKST();
    const currentYear = today.getUTCFullYear();

    const sortedBirthdays: VocaloidBirthday[] = birthdays.map(vocaloid => {
        const birthDate = new Date(vocaloid.date);
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        const year = birthDate.getFullYear();

        const birthdayThisYear = new Date(Date.UTC(currentYear, month - 1, day));
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
                const birthdayNextYear = new Date(Date.UTC(currentYear + 1, month - 1, day));
                upcomingDDay = Math.round((birthdayNextYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            }
            dDayText = `D-${upcomingDDay}`;
            sortKey = upcomingDDay;
        }

        return {
            name: vocaloid.name,
            month,
            day,
            year,
            color: vocaloid.color,
            dDayText,
            isHighlight,
            sortKey,
            anniversary: currentYear - year
        };
    }).toSorted((a, b) => a.sortKey - b.sortKey);

    const sitesForFooter = sites.filter(site => site.show);

    return (
        <footer className="border-t border-gray-200/80 bg-white mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Creator Info & Recruitment */}
                    <div className="flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm h-full flex flex-col">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#39C5BB] to-[#2fa098] text-white shadow-md shadow-[#39C5BB]/20">
                                            <Music size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-800">Created by MIKUMIKU</h4>
                                            <p className="text-[11px] font-medium text-[#39C5BB]">Vocaloid Fan Site</p>
                                        </div>
                                    </div>
                                    <Sparkles className="text-yellow-400 animate-pulse" size={18} />
                                </div>
                                
                                <div className="space-y-2 text-md text-gray-600 leading-relaxed mb-5 flex-grow">
                                    <p>
                                        하츠네 미쿠를 향한 팬심을 담아<br/>
                                        한줄 한줄 정성스럽게 개발했습니다.
                                    </p>
                                    <p className="font-bold text-[#39C5BB]">
                                        미쿠미쿠하게 해줄게 ♪
                                    </p>
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm">
                                        <p className="font-medium text-gray-700 mb-0.5 flex items-center gap-1.5">
                                            <Heart size={12} className="text-pink-500 fill-pink-500" />
                                            같이 사이트를 만들어가요!
                                        </p>
                                        <p className="text-gray-500">
                                            <span className="text-[#39C5BB] font-bold">문의</span>, <span className="text-[#39C5BB] font-bold">건의사항</span>, <span className="text-[#39C5BB] font-bold">편집자 지원</span> 환영합니다.
                                        </p>
                                    </div>
                                </div>
                                
                                <a href="mailto:contact@hatsunemiku.me"
                                   className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-[#39C5BB] hover:text-[#39C5BB] hover:shadow-sm group mt-auto">
                                    <Send size={16} className="text-[#39C5BB] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    문의하기
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Vocaloid Birthdays */}
                    <div className="flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm h-full flex flex-col">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md shadow-pink-400/20">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-800">Vocaloid Birthdays</h4>
                                            <p className="text-[11px] font-medium text-pink-500">Upcoming Anniversaries</p>
                                        </div>
                                    </div>
                                </div>

                                <ul className="grid grid-cols-[auto_1fr] gap-y-0.5 flex-grow mb-3">
                                    {sortedBirthdays.slice(0, 5).map((vocaloid) => (
                                        <BirthdayListItem key={vocaloid.name} vocaloid={vocaloid} />
                                    ))}
                                </ul>

                                {sortedBirthdays.length > 5 && (
                                    <button onClick={() => setIsBirthdayModalOpen(true)}
                                            className="mt-auto w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-pink-400 hover:text-pink-500 hover:shadow-sm group">
                                        <span>전체 보기</span>
                                        <ArrowRight size={16} className="text-pink-500 transition-transform group-hover:translate-x-0.5"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vocaloid Sites */}
                    <div className="flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm h-full flex flex-col">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md shadow-blue-400/20">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-800">Vocaloid Sites</h4>
                                            <p className="text-[11px] font-medium text-blue-500">Official & Fan Sites</p>
                                        </div>
                                    </div>
                                </div>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow content-start mb-3">
                                    {sitesForFooter.map((site) => (
                                        <li key={site.name}><LinkedSiteCard site={site}/></li>
                                    ))}
                                </ul>

                                {sites.length > sitesForFooter.length && (
                                    <button onClick={() => setIsLinkedSitesModalOpen(true)}
                                            className="mt-auto w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-blue-400 hover:text-blue-500 hover:shadow-sm group">
                                        <span>전체 보기</span>
                                        <ArrowRight size={16} className="text-blue-500 transition-transform group-hover:translate-x-0.5"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

              {/* Copyright */}
              <div className="mt-10 border-t border-gray-200/80 pt-6 text-center">
                <p className="text-sm font-semibold text-gray-700 select-none">
                  &copy; {new Date().getFullYear()} HatsuneMiku.me
                </p>
                <p className="mt-1.5 text-[11px] text-gray-500 leading-tight">
                  This is a non-commercial fan-made website. All characters, music, and other trademarks/copyrights
                  are the property of their respective owners, including Crypton Future Media, INC.
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Ranking data is provided under the <a href="https://wiki.vocadb.net/docs/license" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Creative Commons Attribution license</a> by <a href="https://vocadb.net/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">VocaDB</a>.
                </p>
              </div>
            </div>

            {/* Vocaloid Birthday Modal */}
            {isBirthdayModalOpen && (
                <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0 text-gray-800">
                            <Calendar className="text-[#39C5BB]"/> 보컬로이드 생일
                        </h3>
                        <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
                            <ul className="grid grid-cols-[auto_1fr] gap-y-1">
                                {sortedBirthdays.map((vocaloid) => (
                                    <BirthdayListItem key={vocaloid.name} vocaloid={vocaloid} />
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => setIsBirthdayModalOpen(false)}
                                className="mt-6 px-4 py-3 bg-[#39C5BB] text-white font-bold rounded-xl hover:bg-[#2fa098] transition-colors duration-200 w-full flex-shrink-0 shadow-lg shadow-[#39C5BB]/20">
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* Vocaloid Sites Modal */}
            {isLinkedSitesModalOpen && (
                <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 flex-shrink-0 text-gray-800">
                            <ExternalLink className="text-[#39C5BB]"/> 보컬로이드 사이트
                        </h3>
                        <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {sites.map((site) => (
                                    <li key={site.name}><LinkedSiteCard site={site}/></li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => setIsLinkedSitesModalOpen(false)}
                                className="mt-6 px-4 py-3 bg-[#39C5BB] text-white font-bold rounded-xl hover:bg-[#2fa098] transition-colors duration-200 w-full flex-shrink-0 shadow-lg shadow-[#39C5BB]/20">
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </footer>
    );
}
