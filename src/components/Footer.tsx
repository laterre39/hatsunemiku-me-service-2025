import Link from 'next/link';
import { FiTwitter, FiYoutube, FiFacebook } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-lobster text-2xl text-miku-turquoise">hatsunemiku.me</h3>
            <p className="mt-2 text-miku-gray">Your ultimate portal to the world of Hatsune Miku.</p>
          </div>
          <div>
            <h4 className="font-bold text-miku-dark">Quick Links</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/music" className="text-miku-gray hover:text-miku-turquoise">Music</Link></li>
              <li><Link href="/gallery" className="text-miku-gray hover:text-miku-turquoise">Gallery</Link></li>
              <li><Link href="/news" className="text-miku-gray hover:text-miku-turquoise">News</Link></li>
              <li><Link href="/about" className="text-miku-gray hover:text-miku-turquoise">About</Link></li>
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