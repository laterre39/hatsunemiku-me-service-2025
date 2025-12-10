export interface Pv {
    id: number;
    service: string;
    url: string;
}

export interface WebLink {
    description: string;
    url: string;
}

export interface Song {
    rank: number;
    title: string;
    artist: string;
    album?: string;
    duration: string;
    thumbnailUrl: string;
    platformId: string;
    pvs: Pv[];
    webLinks: WebLink[];
}
