"use client";

import "./globals.css";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import localFont from 'next/font/local'
import {FlowbiteClient} from '@/components/FlowbiteClient';
import {ScrollToTopButton} from '@/components/ScrollToTopButton';
import {BuyMeACoffee} from "@/components/BuyMeACoffee";
import {Helmet, HelmetProvider} from "@dr.pogodin/react-helmet";

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
  const siteUrl = "https://hatsunemiku.me/";
  const title = "HATSUNEMIKU.ME";
  const description = "하츠네 미쿠와 보컬로이드 공식 정보 & 최신 뉴스 아카이브. 신곡, 라이브 콘서트, 이벤트 소식 등 모든 것을 가장 빠르게 만나보세요";
  const imageUrl = `${siteUrl}cherrypop.png`;

  return (
      <HelmetProvider>
        <html lang="ko" className={`${pretendard.variable} scroll-smooth`}>
        <body>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href="https://hatsunemiku.me/"/>
          <meta name="description" content={description}/>
          <meta charSet="utf-8"/>
          <link rel="icon" href="/cherrypop_ico.png"/>

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website"/>
          <meta property="og:url" content={siteUrl}/>
          <meta property="og:title" content={title}/>
          <meta property="og:description" content={description}/>
          <meta property="og:image" content={imageUrl}/>
          <meta property="og:image:width" content="800"/>
          <meta property="og:image:height" content="600"/>
          <meta property="og:site_name" content={title}/>
          <meta property="og:locale" content="ko_KR"/>

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content={siteUrl}/>
          <meta property="twitter:title" content={title}/>
          <meta property="twitter:description" content={description}/>
          <meta property="twitter:image" content={imageUrl}/>
        </Helmet>

        <div className="relative flex min-h-screen flex-col bg-[url('/main_bg.png')] bg-repeat">
          <Header/>
          <main className="flex-1 container mx-auto px-4 max-w-5xl">
            {children}
          </main>
          <Footer/>
          <FlowbiteClient/>
          <ScrollToTopButton/>
          <BuyMeACoffee/>
        </div>
        </body>
        </html>
      </HelmetProvider>
  );
}
