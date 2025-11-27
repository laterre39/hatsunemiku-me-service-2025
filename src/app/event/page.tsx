import { EventPageClient } from '@/components/EventPageClient';
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Event',
  description: '하츠네 미쿠와 보컬로이드 관련 최신 이벤트 정보를 확인하세요!',
  openGraph: {
    title: 'Event | HATSUNEMIKU.ME',
    description: '하츠네 미쿠와 보컬로이드 관련 최신 이벤트 정보를 확인하세요!',
    url: 'https://hatsunemiku.me/event',
  },
};

export default function EventPage() {
  return <EventPageClient />; // TODO:추후에 리팩토링
}
