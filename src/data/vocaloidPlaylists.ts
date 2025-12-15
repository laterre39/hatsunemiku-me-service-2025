export interface PlaylistInfo {
  id: string;
  platform: 'youtube' | 'spotify'; // 플랫폼 타입 수정
  title: string;
  description?: string;
  creator?: string;
  featuredTrackIndices?: number[];
  isSlider?: boolean;
}

export const vocaloidPlaylists: PlaylistInfo[] = [
  {
    id: 'PLwtkfpqgkPlNcHB-QUlXOGTtQaXLJ_txr',
    platform: 'youtube', // youtube, spotify 플랫폼을 지정합니다.
    title: '에모이 도핑제',
    description: '듣고 가슴벅차고 에모이해지는 곡들을 모았습니다. (제작자의 취향이 많이 반영되어 있습니다.)',
    creator: '카피포리',
    //featuredTrackIndices: [0, 2, 4, 6, 8], // 섬네일에 표시될 음악을 5개 정의합니다.
    isSlider: true, // 추천 플리에 보일지 여부
  },
  {
    id: 'PLRs0SDrpFZ7tru4sztL1bQym2J-QZR_kP',
    platform: 'youtube',
    title: '일렉트로닉 하이',
    description: '전자음으로 널 유린하겠다',
    creator: 'ఠ_ఠ',
    isSlider: true,
  },
  {
    id: 'PL4DYOoQTb3iY-jliX1Ta_sCwpz02esiZz',
    platform: 'youtube',
    title: '한국의 보카로p',
    description: '보컬로이드도 신토불이! 한국의 프로듀서들을 만나보세요.',
    creator: 'MIKUMIKU 외 2명',
    isSlider: true,
  },
  {
    id: '0rDPDKkz0Rf36ayZVodsUj?si=8o_UzidRQMuK8t9FiQw7hg',
    platform: 'spotify',
    title: 'ボカロ好き',
    description: '보카로스키',
    creator: '즌다몬',
    isSlider: false,
  },
  {
    id: '7dZHhKeIJ8ZjDFLjCJOpJC?si=WzwlmBS6S5CA6KRE22sDug',
    platform: 'spotify',
    title: 'New Release VOCALOID from subscription',
    description: '各種配信サービスにて新しく配信が開始されたVOCALOID楽曲です。毎週日曜更新',
    creator: 'コーチ',
    isSlider: false,
  },
  {
    id: 'PLRs0SDrpFZ7sDAxpc_UqAGZzxxvjm5TPn&si=w-AYBeMHZjgWo0CE',
    platform: 'youtube',
    title: '간뇌 플레이리스트',
    description: '감동적인곡을들으면간뇌가덜덜떨리고간뇌가덜덜떨리면간뇌의자극에의해시상하부의자극에의해눈물샘이자극되어눈물이줄줄나오게됩니다',
    creator: 'ఠ_ఠ',
    isSlider: false,
  },
];
