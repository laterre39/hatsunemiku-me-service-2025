interface LinkedSite {
    name: string;
    url: string;
    showInFooter: boolean;
}

export const linkedSites: LinkedSite[] = [
    { name: "Official Blog", url: "https://blog.piapro.net/", showInFooter: true },
    { name: "Official X", url: "https://x.com/cfm_miku_en", showInFooter: true },
    { name: "Official Facebook", url: "https://www.facebook.com/HatsuneMikuOfficialPage", showInFooter: true },
    { name: "Official Instagram", url: "https://www.instagram.com/cfm_mikustagram/", showInFooter: true },
    { name: "KARENT Music", url: "https://karent.jp/", showInFooter: true },
    { name: "마지미라 정보", url: "https://mm-info.miku.kr/", showInFooter: false },
    { name: "Piapro", url: "https://piapro.jp/", showInFooter: false },
    { name: "VocaDB", url: "https://vocadb.net/", showInFooter: false },
    { name: "Project SEKAI", url: "https://pjsekai.sega.jp/", showInFooter: false },
    { name: "Magical Mirai", url: "https://magicalmirai.com/", showInFooter: false },
    { name: "Snow Miku", url: "https://snowmiku.com/", showInFooter: false },
    { name: "VocaMap", url: "https://www.vocamap.jp/", showInFooter: false },
    { name: "Vocalendar", url: "https://vocalendar.jp/", showInFooter: false },
];
