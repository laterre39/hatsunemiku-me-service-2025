import {Metadata} from 'next';
import {Crown} from "lucide-react";

export const metadata: Metadata = {
    title: 'About',
};

export default function About() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl text-white font-bold mb-4">Welcome to HATSUNEMIKU.ME</h1>
            <p className="flex flex-col text-white space-y-2">
                <span>
                    환영합니다, 여기 사이트는 하츠네 미쿠 및 보컬로이드 같은 음성 합성 엔진 프로그램의 <br />캐릭터 정보들을 안내하고 제공하기 위한 사이트로 서비스하고 있습니다.
                </span>
                <span>
                    사이트에 관련된 문의 또는 기능 건의 등은 하단 푸터의 메일로 문의 부탁드립니다.
                </span>
                <span className="text-sm font-light">
                    VOCALOID: 좁은 의미에서의 보컬로이드는 음성 합성 엔진 프로그램 VOCALOID만을 의미하지만 넓은 의미에서의 보컬로이드는
                    <br />보컬로이드 가수(음성 합성 엔진) 및 이미지 캐릭터가 사용되는 문화 전반을 아우르는 용어로 사용되고 있으며 사이트에서도 동일하게 의미합니다.
                </span>
            </p>
            <p className="flex flex-col text-white space-y-2 mt-8">
                <span className="flex items-center text-xl font-bold gap-2 underline underline-offset-4 decoration-[#39C5BB]"><Crown />Spacial Thanks</span>
                <span>자택관리인 | 일러스트 제공</span>
                <span>하츠네 미쿠 마이너 갤러리 | 아이디어 및 정보 제공</span>
            </p>
        </main>
    );
}
