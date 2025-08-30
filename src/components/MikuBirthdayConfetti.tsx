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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-2xl max-w-lg mx-4">
                <h2 className="text-4xl font-bold text-white">🎉 Happy Birthday, HATSUNE MIKU! 🎉</h2>
                <p className="mt-4 text-lg text-gray-200">8월 31일은 하츠네 미쿠의 생일입니다! 함께 축하해주세요!</p>
                <div className="mt-6 flex justify-center gap-4">
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
                <button
                    onClick={() => setShowMikuBirthday(false)}
                    className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24}/>
                </button>
            </div>
        </div>
    );
}
