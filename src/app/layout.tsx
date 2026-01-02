import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import localFont from 'next/font/local'
import { FlowbiteClient } from '@/components/FlowbiteClient';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { getVocaBirthdays } from "@/services/birthdayService";
import { getVocaSites } from "@/services/siteService";

const siteConfig = {
  title: "HATSUNEMIKU.ME",
  description: "하츠네 미쿠와 보컬로이드 팬들을 위한 비공식 팬 사이트입니다. 최신 인기곡, 이벤트, 커뮤니티 정보를 확인하세요.",
  url: "https://hatsunemiku.me",
  keywords: ["하츠네 미쿠", "보컬로이드", "Hatsune Miku", "Vocaloid"],
  author: "39AREA",
  ogImage: "https://hatsunemiku.me/og_image.png",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  
  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 800,
        height: 600,
        alt: siteConfig.title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.author}`,
  },
};

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [birthdays, sites] = await Promise.all([
    getVocaBirthdays(),
    getVocaSites(),
  ]);

  return (
    <html lang="ko" className={`${pretendard.variable} scroll-smooth`}>
      <body className="bg-[url('/main_bg.png')] bg-repeat">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 max-w-5xl">
            {children}
          </main>
          <Footer birthdays={birthdays} sites={sites} />
          <FlowbiteClient />
          <ScrollToTopButton />
          <BuyMeACoffee />
        </div>
      </body>
    </html>
  );
}
