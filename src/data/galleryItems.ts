export interface GalleryItem {
    id: number;
    title: string;
    content: string;
    artist: string;
    artistUrl: string;
    sourceUrl: string;
    imageUrl: string; // Path relative to /public
}

// Placeholder data. Replace with your curated and permitted artworks.
export const galleryItems: GalleryItem[] = [
    {
        id: 1,
        title: "하츠네 미쿠 체리팝",
        content: "그려봤어요",
        artist: "자택관리",
        artistUrl: "https://gall.dcinside.com/mikuhatsune/381515",
        sourceUrl: "https://gall.dcinside.com/mikuhatsune/381515",
        imageUrl: "/gallery/cherrypop.png",
    },
    {
        id: 2,
        title: "미쿠 생일 축하",
        content: "미쿠그렷삼 아 생일이셔?",
        artist: "Sei",
        artistUrl: "https://x.com/Sei_Oekaki__",
        sourceUrl: "https://gall.dcinside.com/mikuhatsune/408662",
        imageUrl: "/gallery/mikualbum-sei.jpg",
    },
    {
        id: 3,
        title: "박스탄 밐냥이",
        content: "박스탄 밐냥이 그려보았다",
        artist: "고먀",
        artistUrl: "https://x.com/gomya3939",
        sourceUrl: "https://gall.dcinside.com/mikuhatsune/391816",
        imageUrl: "/gallery/1756832202.jpg",
    },
    {
        id: 4,
        title: "윤회 미쿠",
        content: "미쿠 귀여워",
        artist: "cocokana",
        artistUrl: "https://x.com/cox2kana",
        sourceUrl: "https://gall.dcinside.com/mikuhatsune/385337",
        imageUrl: "/gallery/1756832527.png",
    },
];
