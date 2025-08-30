'use client';

import {useState} from 'react';
import {vocaloidBirthdays} from '@/data/vocaloidBirthdayLists';
import {linkedSites} from "@/data/linkedSites";
import {AudioLines, BadgeCheck, Cake, ExternalLink, Link, PenTool, Send} from "lucide-react";
import {FaCompactDisc, FaFacebook, FaSquareInstagram, FaSquareXTwitter} from "react-icons/fa6";

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
        let sortKey = 0;
        let dDayText = '';

        if (diffDays <= 0 && diffDays >= -2) {
            isHighlight = true;
            sortKey = diffDays; // Sorts D+2(-2), D+1(-1), D-DAY(0) to the top
        } else {
            let upcomingDDay = diffDays;
            if (diffDays < -2) { // Birthday has passed more than 2 days ago
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

    return (
        <footer className="border-t border-gray-200/80 bg-white mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap items-start justify-center gap-8">
                    {/* Creator Info */}
                    <div className="w-sm">
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <PenTool className="text-gray-700" size={18}/>
                                <h4 className="text-xl font-semibold text-gray-800">Created by MIKUMIKU</h4>
                            </div>
                            <div className="mt-2 h-1 w-64 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <p>하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span
                                className="font-bold text-[#39C5BB]">미쿠 사랑해</span>🩵 사이트 관련
                                문의는 하단의 메일로 문의 부탁드립니다. </p>
                            <p>사이트 운영을 위한 <span className="font-bold text-[#39C5BB]">편집자</span>를 모집하고 있습니다. 관련 문의도 하단의 <span className="font-bold">메일로 문의</span>를 부탁드립니다.</p>
                            <p className="font-bold text-[#39C5BB]">미쿠미쿠하게 해줄게 ♪</p>
                            <a href="mailto:loff98997@gmail.com"
                               className="flex items-center gap-1 font-semibold text-gray-600 hover:text-[#39C5BB]">
                                <Send size={18}/>
                                Send Mail
                            </a>
                        </div>
                    </div>

                    {/* Upcoming Birthdays */}
                    <div className="w-sm">
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <Cake className="text-gray-700" size={18}/>
                                <h4 className="text-xl font-semibold text-gray-800">Upcoming Birthdays</h4>
                            </div>
                            <div className="mt-2 h-1 w-64 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
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
                                        style={!vocaloid.isHighlight ? {color: vocaloid.color, textDecorationColor: vocaloid.color} : {color: vocaloid.color}}
                                    >
                                        {vocaloid.name}
                                    </span>
                                    <div className="justify-self-end flex items-center gap-2 font-bold text-gray-700">
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
                                <ExternalLink size={18} />
                                더보기
                            </button>
                        )}
                    </div>

                    {/* Linked Sites */}
                    <div className="w-sm">
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <Link className="text-gray-700" size={18}/>
                                <h4 className="text-xl font-semibold text-gray-800">Linked Sites</h4>
                            </div>
                            <div className="mt-2 h-1 w-64 bg-gradient-to-r from-[#39C5BB] to-cyan-200 rounded-full"/>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li>
                                <a href="https://blog.piapro.net/" className="flex items-center gap-2 hover:text-[#39C5BB]">
                                    <AudioLines size={20}/>
                                    <span className="font-medium">Official Blog</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/cfm_miku_en" className="flex items-center gap-2 hover:text-[#39C5BB]">
                                    <FaSquareXTwitter size={20}/>
                                    <span className="font-medium">Official X</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/HatsuneMikuOfficialPage"
                                   className="flex items-center gap-2 hover:text-[#39C5BB]">
                                    <FaFacebook size={20}/>
                                    <span className="font-medium">Official Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/cfm_mikustagram/"
                                   className="flex items-center gap-2 hover:text-[#39C5BB]">
                                    <FaSquareInstagram size={20}/>
                                    <span className="font-medium">Official Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://karent.jp/" className="flex items-center gap-2 hover:text-[#39C5BB]">
                                    <FaCompactDisc size={20}/>
                                    <span className="font-medium">KARENT Music</span>
                                </a>
                            </li>
                        </ul>
                        <button onClick={() => setIsLinkedSitesModalOpen(true)}
                                className="flex items-center gap-1 pt-2 font-bold text-gray-600 hover:text-[#39C5BB]">
                            <ExternalLink size={18} />
                            더보기
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm text-gray-600">
                    <p className="font-semibold">&copy; {new Date().getFullYear()} HatsuneMiku.me</p>
                    <p className="mt-2 font-light">This is a non-commercial fan-made website.</p>
                    <p className="font-light">
                        Hatsune Miku and other VOCALOID characters are trademarks and copyrights of Crypton Future
                        Media, INC. and their respective owners.
                    </p>
                </div>
            </div>

            {/* Birthday Modal */}
            {isBirthdayModalOpen && (
                <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-[#39C5BB] flex-shrink-0">
                            <Cake/> 보컬로이드 생일</h3>
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
                                            style={!vocaloid.isHighlight ? {color: vocaloid.color, textDecorationColor: vocaloid.color} : {color: vocaloid.color}}
                                        >
                                            {vocaloid.name}
                                        </span>
                                        <div className="justify-self-end flex items-center gap-2 font-bold text-gray-700">
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
                        </div>
                        <button onClick={() => setIsBirthdayModalOpen(false)}
                                className="mt-6 px-4 py-2 bg-[#39C5BB] text-white rounded-md hover:bg-[#2fa098] transition-colors duration-200 w-full flex-shrink-0">
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* Linked Sites Modal */}
            {isLinkedSitesModalOpen && (
                <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-[#39C5BB] flex-shrink-0">
                            <Link/> 보컬로이드 사이트</h3>
                        <div className="overflow-y-auto max-h-96">
                            <ul className="space-y-2 pr-4">
                                {linkedSites.map((site) => (
                                    <li key={site.name}>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 hover:text-[#39C5BB]">
                                            <BadgeCheck />
                                            <span className="font-medium">{site.name}</span>
                                        </a>
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
