export interface GalleryItem {
    id: number;
    title: string;
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
        artist: "자택관리",
        artistUrl: "https://gall.dcinside.com/mikuhatsune/381515",
        sourceUrl: "https://gall.dcinside.com/mikuhatsune/381515",
        imageUrl: "/gallery/cherrypop.png",
    },
    {
        id: 2,
        title: "굿스마일 레이싱",
        artist: "Melt3d Works",
        artistUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EA%B3%A0%EC%B8%B5-%EA%B1%B4%EB%AC%BC-%EC%98%86%EC%9D%98-%EB%8F%84%EC%8B%9C-%EA%B1%B0%EB%A6%AC%EB%A5%BC-%EC%9A%B4%EC%A0%84%ED%95%98%EB%8A%94-%EC%9E%90%EB%8F%99%EC%B0%A8-4gD5fzdj_GY",
        sourceUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EA%B3%A0%EC%B8%B5-%EA%B1%B4%EB%AC%BC-%EC%98%86%EC%9D%98-%EB%8F%84%EC%8B%9C-%EA%B1%B0%EB%A6%AC%EB%A5%BC-%EC%9A%B4%EC%A0%84%ED%95%98%EB%8A%94-%EC%9E%90%EB%8F%99%EC%B0%A8-4gD5fzdj_GY",
        imageUrl: "/gallery/melt3d-works-4gD5fzdj_GY-unsplash.jpg",
    },
    {
        id: 3,
        title: "크레인 속 믹빵이",
        artist: "TrebleExtension",
        artistUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EB%B4%89%EC%A0%9C-%EC%9D%B8%ED%98%95%EC%9D%B4-%EB%93%A4%EC%96%B4-%EC%9E%88%EB%8A%94-%EC%9D%B8%ED%98%95-%EB%BD%91%EA%B8%B0-%EA%B8%B0%EA%B3%84-F-CVZaa4GOw",
        sourceUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EB%B4%89%EC%A0%9C-%EC%9D%B8%ED%98%95%EC%9D%B4-%EB%93%A4%EC%96%B4-%EC%9E%88%EB%8A%94-%EC%9D%B8%ED%98%95-%EB%BD%91%EA%B8%B0-%EA%B8%B0%EA%B3%84-F-CVZaa4GOw",
        imageUrl: "/gallery/trebleextension-F-CVZaa4GOw-unsplash.jpg",
    },
    {
        id: 4,
        title: "타이토 하츠네 미쿠 피규어",
        artist: "张 宇铭",
        artistUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%85%B9%EC%83%89-%EB%A8%B8%EB%A6%AC-%EC%86%8C%EB%85%80-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EC%BA%90%EB%A6%AD%ED%84%B0-ck-p536ihvg",
        sourceUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%85%B9%EC%83%89-%EB%A8%B8%EB%A6%AC-%EC%86%8C%EB%85%80-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EC%BA%90%EB%A6%AD%ED%84%B0-ck-p536ihvg",
        imageUrl: "/gallery/auceinss-ck-p536ihvg-unsplash.jpg",
    },
];
