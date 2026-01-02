import { EventPageClient } from '@/components/EventPageClient';
import type { Metadata } from "next";
import { getVocaEvents } from "@/services/eventService";

export const metadata: Metadata = {
  title: 'Event',
  description: '하츠네 미쿠와 보컬로이드 관련 최신 이벤트 정보를 확인하세요!',
  openGraph: {
    title: 'Event | HATSUNEMIKU.ME',
    description: '하츠네 미쿠와 보컬로이드 관련 최신 이벤트 정보를 확인하세요!',
    url: 'https://hatsunemiku.me/event',
  },
};

export const revalidate = 21600; // 6시간마다 재검증 (6 * 60 * 60)

export default async function EventPage() {
  const events = await getVocaEvents();
  return <EventPageClient initialEvents={events} />;
}
