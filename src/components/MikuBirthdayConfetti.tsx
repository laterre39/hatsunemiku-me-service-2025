'use client';

import {Fragment, useEffect, useState} from 'react';
import {X} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocaBirthday } from '@/services/birthdayService';

interface BirthdayVocaloid {
    name: string;
    color: string;
}

interface MikuBirthdayConfettiProps {
    birthdays: VocaBirthday[];
}

export function MikuBirthdayConfetti({ birthdays }: MikuBirthdayConfettiProps) {
    const [birthdayVocaloids, setBirthdayVocaloids] = useState<BirthdayVocaloid[]>([]);
    const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);

    useEffect(() => {
        const getTodayKST = () => {
            const now = new Date();
            const kstDateString = now.toLocaleDateString('en-CA', {timeZone: 'Asia/Seoul'});
            return new Date(kstDateString + 'T00:00:00Z');
        };

        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('hideBirthdayPopup='));
        if (cookieValue) {
            return;
        }

        const today = getTodayKST();
        const month = today.getUTCMonth() + 1; // 1-12
        const day = today.getUTCDate();

        const todayVocaloids = birthdays.filter(v => {
            const birthDate = new Date(v.date);
            return (birthDate.getMonth() + 1) === month && birthDate.getDate() === day;
        });

        if (todayVocaloids.length > 0) {
            setBirthdayVocaloids(todayVocaloids.map(v => ({ name: v.name, color: v.color })));
            setShowBirthdayPopup(true);

            const duration = 5 * 1000; // 5 seconds
            const animationEnd = Date.now() + duration;
            const colors = todayVocaloids.map(v => v.color);

            const frame = () => {
                if (Date.now() > animationEnd) {
                    return;
                }

                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: {x: 0},
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: {x: 1},
                    colors: colors
                });

                requestAnimationFrame(frame);
            };

            frame();
        }
    }, [birthdays]);

    const handleStopShowing = () => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 1); // Cookie expires in 1 day
        document.cookie = `hideBirthdayPopup=true;expires=${expires.toUTCString()};path=/`;
        setShowBirthdayPopup(false);
    };

    if (!showBirthdayPopup || birthdayVocaloids.length === 0) {
        return null;
    }

    const getPanelBackground = () => {
        const colors = birthdayVocaloids.map(v => v.color);
        if (colors.length === 1) {
            return `linear-gradient(to bottom right, ${colors[0]}33, ${colors[0]}1A)`;
        }
        const gradientColors = colors.map(c => `${c}33`).join(', ');
        return `linear-gradient(to bottom right, ${gradientColors})`;
    };

    const renderBirthdayNames = (isBold: boolean) => (
        <>
            {birthdayVocaloids.map((v, index) => (
                <Fragment key={v.name}>
                    <span className={isBold ? "font-bold" : ""} style={{ color: v.color }}>{v.name}</span>
                    {index < birthdayVocaloids.length - 1 && ', '}
                </Fragment>
            ))}
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="relative border border-white/20 rounded-2xl p-8 text-center shadow-2xl max-w-2xl w-full overflow-hidden"
                style={{ background: getPanelBackground() }}
            >
                {/* Watermark */}
                <div
                    className="absolute -top-1/4 -right-1/4 text-white/5 font-bold text-[20rem] leading-none select-none">
                    🎉
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
                        🎉 Happy Birthday, {renderBirthdayNames(false)}! 🎉
                    </h2>
                    <p className="mt-4 text-lg text-gray-200">
                        오늘은 {renderBirthdayNames(true)}의 생일입니다! 함께 축하해주세요!
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={() => setShowBirthdayPopup(false)}
                            className="px-6 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                        >
                            닫기
                        </button>
                        <button
                            onClick={handleStopShowing}
                            className="px-6 py-2 bg-transparent text-white/60 font-semibold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            오늘 하루 그만보기
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setShowBirthdayPopup(false)}
                    className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-20"
                >
                    <X size={24}/>
                </button>
            </div>
        </div>
    );
}
