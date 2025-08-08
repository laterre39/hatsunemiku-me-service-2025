import Link from 'next/link';
import { Send, AudioLines } from 'lucide-react';
import { FaSquareXTwitter, FaFacebook, FaSquareInstagram, FaCompactDisc } from "react-icons/fa6";
import { Tooltip as FlowbiteTooltip } from 'flowbite-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white mt-12">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          <div>
            <h4 className="text-xl text-miku-turquoise underline underline-offset-4 decoration-4 decoration-[#39C5BB]">Created by MIKUMIKU</h4>
            <p className="mt-4 text-miku-gray">하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span className="text-[#39C5BB] underline underline-offset-1">미쿠 사랑해</span>🩵 사이트 관련 문의는 하단의 메일로 문의 부탁드립니다. </p>
            <p className="font-bold text-[#39C5BB]">미쿠미쿠하게 해줄게 ♪</p>
            <a href="mailto:loff98997@gmail.com" className="flex items-center gap-1 mt-2 font-semibold hover:underline">
              <Send size={15} />
              Send Mail
            </a>
          </div>
          <div>
            <h4 className="text-xl text-miku-turquoise">Quick Links</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/about" className="text-miku-gray hover:text-miku-turquoise">About</Link></li>
              <li><Link href="/music" className="text-miku-gray hover:text-miku-turquoise">Music</Link></li>
              <li><Link href="/gallery" className="text-miku-gray hover:text-miku-turquoise">Gallery</Link></li>
              <li><Link href="/news" className="text-miku-gray hover:text-miku-turquoise">News</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl text-miku-turquoise">Linked Sites</h4>
            <div className="mt-2 flex space-x-4">
              <ul className="mt-2 flex flex-row space-x-4">
              <li>
                <FlowbiteTooltip content="Official X" placement="top" style="light">
                  <a href="https://x.com/cfm_miku_en" className="text-miku-gray hover:text-miku-turquoise">
                    <FaSquareXTwitter size={24} />
                  </a>
                </FlowbiteTooltip>
              </li>
              <li>
                <FlowbiteTooltip content="Official Facebook" placement="top" style="light">
                  <a href="https://www.facebook.com/HatsuneMikuOfficialPage" className="text-miku-gray hover:text-miku-turquoise">
                    <FaFacebook size={24} />
                  </a>
                </FlowbiteTooltip>
              </li>
              <li>
                <FlowbiteTooltip content="Official Instagram" placement="top" style="light">
                  <a href="https://www.instagram.com/cfm_mikustagram/" className="text-miku-gray hover:text-miku-turquoise">
                    <FaSquareInstagram size={24} />
                  </a>
                </FlowbiteTooltip>
              </li>
              <li>
                <FlowbiteTooltip content="KARENT Music" placement="top" style="light">
                  <a href="https://karent.jp/" className="text-miku-gray hover:text-miku-turquoise">
                    <FaCompactDisc size={24} />
                  </a>
                </FlowbiteTooltip>
              </li>
              <li>
                <FlowbiteTooltip content="Piapro Blog" placement="top" style="light">
                  <a href="https://blog.piapro.net/" className="text-miku-gray hover:text-miku-turquoise">
                    <AudioLines size={24} />
                  </a>
                </FlowbiteTooltip>
              </li>
            </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm text-miku-gray">
          <p className="font-bold">&copy; {new Date().getFullYear()} HatsuneMiku.me</p>
          <p className="mt-1 font-light underline">This is a non-commercial fan-made website.</p>
          <p className="mt-1 font-light underline">
            Hatsune Miku and other VOCALOID characters are trademarks and copyrights of Crypton Future Media, INC. and their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}