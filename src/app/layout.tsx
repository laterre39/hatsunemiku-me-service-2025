import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import localFont from 'next/font/local'
import { FlowbiteClient } from '@/components/FlowbiteClient';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

const pacifico = localFont({
  src: '../assets/fonts/Pacifico-Regular.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-pacifico',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} scroll-smooth`}>
      <body className="font-sans bg-[url('/main_bg.png')] bg-repeat">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 max-w-5xl">
            {children}
          </main>
          <Footer />
          <FlowbiteClient />
        </div>
      </body>
    </html>
  );
}