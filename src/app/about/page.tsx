import {Code, Database, ExternalLink, Heart, HeartPlus, Users} from 'lucide-react';
import {FaFacebook, FaSquareInstagram, FaSquareXTwitter} from "react-icons/fa6";
import React from 'react';
import {specialThanksList} from "@/data/specialThanksList";

// 섹션 제목을 위한 재사용 컴포넌트
const SectionTitle = ({icon, title}: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center mb-4 gap-3 font-bold text-2xl text-white">
        {icon}
        <h2>{title}</h2>
    </div>
);

// 기술 스택 뱃지를 위한 재사용 컴포넌트
const TechBadge = ({name}: { name: string }) => (
    <span
        className="inline-block bg-cyan-400/20 text-cyan-300 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
    {name}
  </span>
);

const getLinkIcon = (type: string) => {
    const iconProps = {size: 20, className: 'text-cyan-400'};
    switch (type) {
        case 'instagram':
            return <FaSquareInstagram {...iconProps} />;
        case 'twitter':
            return <FaSquareXTwitter {...iconProps} />;
        case 'facebook':
            return <FaFacebook {...iconProps} />;
        default:
            return <ExternalLink {...iconProps} />;
    }
};

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-4xl py-12 px-4 text-gray-300">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">우리 사이트를 소개합니다.</h1>
                <p className="text-lg">
                    하츠네 미쿠와 보컬로이드 문화를 사랑하는 모든 팬들을 위한 공간입니다.
                </p>
            </div>

            <div className="flex flex-col divide-y divide-white/30">
                <section className="py-12 first:pt-0 last:pb-0">
                    <SectionTitle icon={<Heart size={24}/>} title="프로젝트의 목표"/>
                    <p className="leading-relaxed">
                        이 프로젝트는 한국의 팬들이 하츠네 미쿠와 보컬로이드 음악을 더 쉽고 깊이 있게 즐길 수 있도록 돕기 위해 시작된 비영리 팬 프로젝트입니다. 분산된 정보를 한데 모아 최신 인기곡,
                        뮤직비디오, 이벤트 소식 등을 제공함으로써 팬 커뮤니티의 활성화에 기여하고자 합니다.
                    </p>
                </section>

                <section className="py-12 first:pt-0 last:pb-0">
                    <SectionTitle icon={<Code size={24}/>} title="사용된 기술"/>
                    <p className="mb-4">
                        이 웹사이트는 다음과 같은 현대적인 기술 스택을 기반으로 제작되었습니다. 각 기술을 선택한 이유는 코드의 안정성과 확장성, 그리고 최상의 사용자 경험을 제공하기 위함입니다.
                    </p>
                    <div>
                        <TechBadge name="Next.js"/>
                        <TechBadge name="React"/>
                        <TechBadge name="TypeScript"/>
                        <TechBadge name="Tailwind CSS"/>
                        <TechBadge name="Swiper.js"/>
                        <TechBadge name="Lucide React"/>
                        <TechBadge name="Vercel"/>
                    </div>
                </section>

                <section className="py-12 first:pt-0 last:pb-0">
                    <SectionTitle icon={<Database size={24}/>} title="데이터 출처 및 집계 방식"/>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-white mb-1">YouTube 랭킹</h3>
                            <p>
                                YouTube Data API를 사용하여 보컬로이드, 하츠네 미쿠 등의 키워드로 검색된 최신 영상들을 조회수 기준으로 정렬하여 상위 10개
                                항목을 보여줍니다.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Spotify 랭킹</h3>
                            <p>
                                Spotify Web API를 통해 주요 보컬로이드 프로듀서들의 트랙 중 인기도가 높은 곡들을 집계하여 순위를 산정합니다. 이는 개별 곡의 인기뿐만 아니라 아티스트의
                                영향력까지 고려한 결과입니다.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-12 first:pt-0 last:pb-0">
                    <SectionTitle icon={<Users size={24}/>} title="기여 및 피드백"/>
                    <p>
                        이 프로젝트는 오픈소스로 운영되며, 여러분의 참여를 언제나 환영합니다. 기능 제안, 버그 리포트, 디자인 개선 등 어떤 형태의 기여든 소중히 생각하겠습니다. 아래 이메일로 연락
                        주세요.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <a href="mailto:contact@hatsunemiku.me"
                           className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            피드백 보내기
                        </a>
                    </div>
                </section>
            </div>

            <section className="py-18 first:pt-0 last:pb-0">
                <div
                    className="flex items-center justify-center mb-6 gap-3 font-bold text-xl text-white underline underline-offset-4 decoration-[#39C5BB]">
                    <HeartPlus size={24}/>
                    <h2>Special Thanks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {specialThanksList.map(({name, contribution, links}) => (
                        <div key={name}
                             className="bg-white/5 p-6 rounded-lg flex flex-col items-center text-center gap-3 transition-all hover:bg-white/10 hover:scale-105">
                            <div>
                                <h3 className="font-semibold text-white text-lg">{name}</h3>
                                <p className="text-sm text-gray-400">{contribution}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                {links?.map((link) => (
                                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                                       className="p-2 rounded-full hover:bg-white/20 transition-colors">
                                        {getLinkIcon(link.type)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}