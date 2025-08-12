import {AudioLines, Send} from 'lucide-react';
import {FaCompactDisc, FaFacebook, FaSquareInstagram, FaSquareXTwitter} from "react-icons/fa6";

export function Footer() {
  const calculateDDay = (month: number, day: number): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    let birthday = new Date(today.getFullYear(), month - 1, day);
    birthday.setHours(0, 0, 0, 0); // Reset time to start of day

    // If birthday has already passed this year, calculate for next year
    if (birthday < today) {
      birthday = new Date(today.getFullYear() + 1, month - 1, day);
      birthday.setHours(0, 0, 0, 0);
    }

    const diffTime = birthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const vocaloidBirthdays = [
    { name: 'Kagamine Rin & Len', month: 12, day: 27, year: 2007, color: '#FFE211' },
    { name: 'Kasane Teto', month: 4, day: 3, year: 2008, color: '#D33C51' },
    { name: 'SeeU', month: 10, day: 21, year: 2011, color: '#FF8C02' },
    { name: 'UNI', month: 2, day: 14, year: 2017, color: '#FA6E98' },
    { name: 'Hatsune Miku', month: 8, day: 31, year: 2007, color: '#39C5BB' },
  ];

  // Sort birthdays to show upcoming ones first
  const sortedBirthdays = vocaloidBirthdays.toSorted((a, b) => {
    const today = new Date();
    const dateA = new Date(today.getFullYear(), a.month - 1, a.day);
    const dateB = new Date(today.getFullYear(), b.month - 1, b.day);

    // If birthday passed this year, consider next year
    if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
    if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);

    return dateA.getTime() - dateB.getTime();
  });

  return (
    <footer className="border-t border-gray-200/80 bg-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-start justify-center gap-4">
          <div className="w-sm">
            <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Created by MIKUMIKU</h4>
            <p className="mt-2 p-2">하츠네 미쿠를 좋아하는 팬심을 담아서 열심히 만들었습니다, <span className="text-[#39C5BB] underline underline-offset-1">미쿠 사랑해</span>🩵 사이트 관련 문의는 하단의 메일로 문의 부탁드립니다. </p>
            <a href="mailto:loff98997@gmail.com" className="flex items-center p-2 gap-1 font-semibold hover:underline">
              <Send size={15} />
              Send Mail
            </a>
          </div>
          <div className="w-sm">
            <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Upcoming Birthdays</h4>
            <ul className="grid grid-cols-[auto_1fr] p-2">
              {sortedBirthdays.map((vocaloid) => {
                const dDay = calculateDDay(vocaloid.month, vocaloid.day);
                const anniversary = new Date().getFullYear() - vocaloid.year;
                return (
                  <li key={vocaloid.name} className="contents space-y-2">
                    <span className="font-semibold underline underline-offset-4 decoration-4" style={{ color: vocaloid.color, textDecorationColor: vocaloid.color }}>{vocaloid.name}</span>
                    <span className="justify-self-end">D-{dDay} ({anniversary}th)</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-sm">
            <h4 className="text-xl text-white p-2 rounded-xl bg-[#39C5BB]">Linked Sites</h4>
            <ul className="mt-2 p-2 space-y-2">
              <li>
                <a href="https://blog.piapro.net/" className="flex items-center gap-2 hover:underline">
                  <AudioLines size={20} />
                  <span>Official Blog</span>
                </a>
              </li>
              <li>
                <a href="https://x.com/cfm_miku_en" className="flex items-center gap-2 hover:underline">
                  <FaSquareXTwitter size={20} />
                  <span>Official X</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/HatsuneMikuOfficialPage" className="flex items-center gap-2 hover:underline">
                  <FaFacebook size={20} />
                  <span>Official Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/cfm_mikustagram/" className="flex items-center gap-2 hover:underline">
                  <FaSquareInstagram size={20} />
                  <span>Official Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://karent.jp/" className="flex items-center gap-2 hover:underline">
                    <FaCompactDisc size={20} />
                    <span>KARENT Music</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200/80 pt-6 text-center text-sm">
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