import { AudioLines, CalendarClock } from 'lucide-react';
import { YouTubeSlider } from '@/components/YouTubeSlider';
import { Tooltip } from '@/components/Tooltip';
import { MikuIntroduction } from '@/components/MikuIntroduction';
import { EventSchedule } from "@/components/EventSchedule";
import { RankingComponent } from "@/components/RankingComponent";
import { MikuBirthdayConfetti } from "@/components/MikuBirthdayConfetti";
import { VocaloidCommunity } from "@/components/VocaloidCommunity";
import { youtubeVideoData } from "@/data/youtubeVideoLists";
import { getVocaEvents } from "@/services/eventService";

export default async function Home() {

    const events = await getVocaEvents();

    return (
        <main>

            {/* My Vocaloid Pick Section */}
            <section className="mx-auto max-w-5xl pb-24">
                <div className="flex items-center mb-6 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>My Vocaloid Pick</h2>
                    <Tooltip text="커뮤니티 유저들의 추천을 통해서 보컬로이드 뮤비를 선정하고 있습니다, 랜덤으로 선정된 20개의 영상을 서비스 하고 있습니다."/>
                </div>
                <YouTubeSlider videos={youtubeVideoData.videos} />
                <div className="flex items-center justify-end gap-2 text-sm text-slate-400 mt-3">
                    <CalendarClock size={16} />
                    <span>Last Updated: {youtubeVideoData.lastUpdated}</span>
                </div>
            </section>

            {/* Miku Introduction Section */}
            <section className="mx-auto max-w-5xl pb-24">
                <div className="flex items-center mb-6 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>About Hatsune Miku</h2>
                    <Tooltip text="🍒 まじで 愛していい感 すきすき？ 恋していい感 すきすき？ どれみが怖いぞ チェリーチェリー そうでもない感 むりむり？ どうでもいい感 むりむり？ トゲみが怖いぞ ベイビーベイビー"/>
                </div>
                <MikuIntroduction/>
            </section>

            {/* Vocaloid Ranking Section */}
            <section className="mx-auto max-w-5xl pb-24">
                <div className="flex items-center mb-6 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Vocaloid Ranking</h2>
                    <Tooltip text="보컬로이드 신곡 랭킹을 집계해서 제공하고 있습니다 [VocaDB 제공]"/>
                </div>
                <RankingComponent/>
            </section>

            {/* Vocaloid Event Schedule Section */}
            <section className="mx-auto max-w-5xl pb-24">
                <div className="flex items-center mb-6 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Vocaloid Event Schedule</h2>
                    <Tooltip text="올해의 보컬로이드 관련 이벤트 스케쥴을 안내합니다."/>
                </div>
                <EventSchedule events={events}/>
            </section>

            {/* Vocaloid Community Section */}
            <section className="mx-auto max-w-5xl pb-24">
                <div className="flex items-center mb-6 gap-2 font-bold text-2xl text-white">
                    <AudioLines/>
                    <h2>Vocaloid Community</h2>
                    <Tooltip text="국내 보컬로이드 커뮤니티를 소개합니다."/>
                </div>
                <VocaloidCommunity/>
            </section>

            {/*생일 표시용 컴포넌트*/}
            <MikuBirthdayConfetti />

        </main>
    );
}
