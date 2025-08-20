import {ReactNode} from "react";

interface LinkedSite {
    name: string;
    url: string;
    icon?: ReactNode;
}

export const linkedSites: LinkedSite[] = [
    { name: "Piapro", url: "https://piapro.jp/" },
    { name: "VocaDB", url: "https://vocadb.net/" },
    { name: "Project SEKAI", url: "https://pjsekai.sega.jp/" },
    { name: "Magical Mirai", url: "https://magicalmirai.com/" },
    { name: "Snow Miku", url: "https://snowmiku.com/" },
    { name: "VocaMap", url: "https://www.vocamap.jp/" },
    { name: "Vocalendar", url: "https://vocalendar.jp/" },
];