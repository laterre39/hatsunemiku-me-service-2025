import Link from 'next/link';
import { FiTwitter, FiYoutube, FiFacebook } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white mt-12">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-xl underline underline-offset-8 text-miku-turquoise">미쿠미쿠하게 해줄게 ♪</h4>
            <p className="mt-4 text-miku-gray">환영합니다 여기 사이트는 하츠네 미쿠의 팬 사이트로 각종 하츠네 미쿠 및 보컬로이드 정보를 제공하고 있습니다.</p>
          </div>
          <div>
            <h4 className="font-bold text-miku-dark">Quick Links</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/about" className="text-miku-gray hover:text-miku-turquoise">About</Link></li>
              <li><Link href="/music" className="text-miku-gray hover:text-miku-turquoise">Music</Link></li>
              <li><Link href="/gallery" className="text-miku-gray hover:text-miku-turquoise">Gallery</Link></li>
              <li><Link href="/news" className="text-miku-gray hover:text-miku-turquoise">News</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-miku-dark">Follow Us</h4>
            <div className="mt-2 flex space-x-4">
              <a href="#" className="text-miku-gray hover:text-miku-turquoise"><FiTwitter size={24} /></a>
              <a href="#" className="text-miku-gray hover:text-miku-turquoise"><FiYoutube size={24} /></a>
              <a href="#" className="text-miku-gray hover:text-miku-turquoise"><FiFacebook size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm text-miku-gray">
          <p>&copy; {new Date().getFullYear()} hatsunemiku.me. All Rights Reserved.</p>
          <p className="mt-1">This is a fan-made website and is not affiliated with Crypton Future Media, INC.</p>
        </div>
      </div>
    </footer>
  );
}