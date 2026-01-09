import React from 'react';
import { AudioLines, ExternalLink, PenTool, BookOpen } from "lucide-react";
import { FaCompactDisc, FaFacebook, FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";

interface IconProps {
    size?: number;
    className?: string;
}

const iconMap: { [key: string]: React.ComponentType<IconProps> } = {
    "Official Blog": AudioLines,
    "Official X": FaSquareXTwitter,
    "Official Facebook": FaFacebook,
    "Official Instagram": FaSquareInstagram,
    "KARENT Music": FaCompactDisc,
    "K!!te": FaCompactDisc,
    "Piapro": PenTool,
    "보카로 가사 위키": BookOpen,
};

export const LinkedSiteCard = ({ site }: { site: { name: string, url: string } }) => {
    const Icon = iconMap[site.name] || ExternalLink;
    return (
        <a href={site.url} target="_blank" rel="noopener noreferrer"
           className="group flex items-center gap-3 rounded-lg p-3 bg-gray-100 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-lg">
            <Icon size={22} className="text-gray-500 transition-colors group-hover:text-cyan-500"/>
            <span className="font-semibold text-sm text-gray-700 transition-colors group-hover:text-cyan-600">{site.name}</span>
        </a>
    );
};
