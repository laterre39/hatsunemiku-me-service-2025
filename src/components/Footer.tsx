'use client';

import {useState} from 'react';
import {vocaloidBirthdays} from '@/data/vocaloidBirthdayLists';
import {linkedSites} from "@/data/linkedSites";
import {AudioLines, Cake, ExternalLink, Link, Send} from "lucide-react";
import {FaCompactDisc, FaFacebook, FaSquareInstagram, FaSquareXTwitter} from "react-icons/fa6";

export function Footer() {
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
    const [isLinkedSitesModalOpen, setIsLinkedSitesModalOpen] = useState(false);

    const calculateDDay = (month: number, day: number): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let birthday = new Date(today.getFullYear(), month - 1, day);
        birthday.setHours(0, 0, 0, 0);
        if (birthday < today) {
            birthday = new Date(today.getFullYear() + 1, month - 1, day);
            birthday.setHours(0, 0, 0, 0);
        }
        const diffTime = birthday.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const sortedBirthdays = vocaloidBirthdays.toSorted((a, b) => {
        const today = new Date();
        const dateA = new Date(today.getFullYear(), a.month - 1, a.day);
        const dateB = new Date(today.getFullYear(), b.month - 1, b.day);
        if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
        if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <footer className="border-t border-gray-200/80 bg-white mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap items-start justify-center gap-4">
                    {/* Creator Info */}
                    <div className="w-sm">
                        <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Created by MIKUMIKU</h4>
                        <div className="p-2 space-y-2">
                            <p>하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span
                                className="font-bold text-[#39C5BB] underline underline-offset-1">미쿠 사랑해</span>🩵 사이트 관련
                                문의는 하단의 메일로 문의 부탁드립니다. </p>
                            <p className="font-bold text-[#39C5BB]">미쿠미쿠하게 해줄게 ♪</p>
                            <a href="mailto:loff98997@gmail.com"
                               className="flex items-center gap-1 font-semibold hover:underline">
                                <Send size={15}/>
                                Send Mail
                            </a>
                        </div>
                    </div>

                    {/* Upcoming Birthdays */}
                    <div className="w-sm">
                        <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Upcoming Birthdays</h4>
                        <ul className="grid grid-cols-[auto_1fr] p-2">
                            {sortedBirthdays.slice(0, 5).map((vocaloid) => {
                                const dDay = calculateDDay(vocaloid.month, vocaloid.day);
                                const anniversary = new Date().getFullYear() - vocaloid.year;
                                return (
                                    <li key={vocaloid.name} className="contents space-y-2">
                                        <span className="font-semibold underline underline-offset-4 decoration-4"
                                              style={{
                                                  color: vocaloid.color,
                                                  textDecorationColor: vocaloid.color
                                              }}>{vocaloid.name}</span>
                                        <span className="justify-self-end">D-{dDay} ({anniversary}th)</span>
                                    </li>
                                );
                            })}
                        </ul>
                        {sortedBirthdays.length > 5 && (
                            <button onClick={() => setIsBirthdayModalOpen(true)}
                                    className="flex items-center gap-1 font-semibold hover:underline px-2">
                                더보기
                            </button>
                        )}
                    </div>

                    {/* Linked Sites */}
                    <div className="w-sm">
                        <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Linked Sites</h4>
                        <ul className="p-2 space-y-2">
                            <li>
                                <a href="https://blog.piapro.net/" className="flex items-center gap-2 hover:underline">
                                    <AudioLines size={20}/>
                                    <span className="font-medium">Official Blog</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/cfm_miku_en" className="flex items-center gap-2 hover:underline">
                                    <FaSquareXTwitter size={20}/>
                                    <span className="font-medium">Official X</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/HatsuneMikuOfficialPage"
                                   className="flex items-center gap-2 hover:underline">
                                    <FaFacebook size={20}/>
                                    <span className="font-medium">Official Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/cfm_mikustagram/"
                                   className="flex items-center gap-2 hover:underline">
                                    <FaSquareInstagram size={20}/>
                                    <span className="font-medium">Official Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://karent.jp/" className="flex items-center gap-2 hover:underline">
                                    <FaCompactDisc size={20}/>
                                    <span className="font-medium">KARENT Music</span>
                                </a>
                            </li>
                        </ul>
                        <button onClick={() => setIsLinkedSitesModalOpen(true)}
                                className="flex items-center gap-1 font-semibold hover:underline px-2">
                            더보기
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm">
                    <p className="font-semibold">&copy; {new Date().getFullYear()} HatsuneMiku.me</p>
                    <p className="mt-2 font-light underline">This is a non-commercial fan-made website.</p>
                    <p className="font-light underline">
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
                            <ul className="grid grid-cols-[auto_1fr] gap-y-2 pr-4">
                                {sortedBirthdays.map((vocaloid) => {
                                    const dDay = calculateDDay(vocaloid.month, vocaloid.day);
                                    const anniversary = new Date().getFullYear() - vocaloid.year;
                                    return (
                                        <li key={vocaloid.name} className="contents">
                                            <span className="font-semibold underline underline-offset-4 decoration-4"
                                                  style={{
                                                      color: vocaloid.color,
                                                      textDecorationColor: vocaloid.color
                                                  }}>{vocaloid.name}</span>
                                            <span className="justify-self-end">D-{dDay} ({anniversary}th)</span>
                                        </li>
                                    );
                                })}
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
                            <Link/> 보컬로이드 관련 사이트</h3>
                        <div className="overflow-y-auto max-h-96">
                            <ul className="space-y-2 pr-4">
                                {linkedSites.map((site) => (
                                    <li key={site.name}>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 hover:underline">
                                            <ExternalLink />
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
