'use client';

import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import confetti from 'canvas-confetti';

export function MikuBirthdayConfetti() {
    const [showMikuBirthday, setShowMikuBirthday] = useState(false);

    useEffect(() => {
        const getTodayKST = () => {
            const now = new Date();
            const kstDateString = now.toLocaleDateString('en-CA', {timeZone: 'Asia/Seoul'});
            return new Date(kstDateString + 'T00:00:00Z');
        };

        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('hideMikuBirthday='));
        if (cookieValue) {
            return;
        }

        const today = getTodayKST();
        const month = today.getUTCMonth(); // 0-11 (January is 0)
        const day = today.getUTCDate();

        if (month === 7 && day === 31) { // August 31st
            setShowMikuBirthday(true);

            const duration = 5 * 1000; // 5 seconds
            const animationEnd = Date.now() + duration;
            const colors = ['#39C5BB', '#88D8D0', '#FFFFFF'];

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
    }, []);

    const handleStopShowing = () => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 1); // Cookie expires in 1 day
        document.cookie = `hideMikuBirthday=true;expires=${expires.toUTCString()};path=/`;
        setShowMikuBirthday(false);
    };

    if (!showMikuBirthday) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="relative bg-gradient-to-br from-[#39C5BB]/20 to-cyan-400/10 border border-white/20 rounded-2xl p-8 text-center shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* Watermark */}
                <div
                    className="absolute -top-1/4 -right-1/4 text-white/5 font-bold text-[20rem] leading-none select-none">
                    39
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
                        🎉 Happy Birthday, <span className="text-[#39C5BB]">HATSUNE MIKU</span> 🩵 🎉
                    </h2>
                    <p className="mt-4 text-lg text-gray-200">
                        8월 31일은 <span className="font-bold text-[#39C5BB]">하츠네 미쿠</span>의 생일입니다! 함께 축하해주세요!
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={() => setShowMikuBirthday(false)}
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
                    onClick={() => setShowMikuBirthday(false)}
                    className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-20"
                >
                    <X size={24}/>
                </button>
            </div>
        </div>
    );
}
