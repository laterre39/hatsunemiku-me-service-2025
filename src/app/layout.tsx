import type {Metadata} from "next";
import "./globals.css";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import localFont from 'next/font/local'
import {FlowbiteClient} from '@/components/FlowbiteClient';
import {ScrollToTopButton} from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  metadataBase: new URL('https://hatsunemiku.me/'),
  title: "HATSUNEMIKU.ME",
  description: "みくみくにしてあげる♪",
  icons: {
    icon: "/cherrypop_ico.png",
  },
  openGraph: {
    title: "HATSUNEMIKU.ME",
    description: "みくみくにしてあげる♪",
    images: [
      {
        url: "/cherrypop.png", // 공유될 이미지 경로
        width: 800,
        height: 600,
        alt: "HATSUNEMIKU.ME",
      },
    ],
    siteName: "HATSUNEMIKU.ME",
    locale: 'ko_KR',
    type: 'website',
  },
};

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} scroll-smooth`}>
      <body className= "bg-[url('/main_bg.png')] bg-repeat">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 max-w-5xl">
            {children}
          </main>
          <Footer />
          <FlowbiteClient />
          <ScrollToTopButton />
        </div>
      </body>
    </html>
  );
}