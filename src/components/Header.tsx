'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Menu, Music2, X} from "lucide-react";
import {Poppins} from "next/font/google";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '700']
});

const navItems = [
    {href: '/about', label: 'About'},
    {href: '/music', label: 'Music'},
    {href: '/event', label: 'Event'},
    {href: '/gallery', label: 'Gallery'},
    {href: '/news', label: 'News'},
];

const NavigationLinks = ({linkClassName, liClassName, onItemClick}: {
    linkClassName: string;
    liClassName?: string;
    onItemClick?: () => void;
}) => (
    <>
        {navItems.map(item => (
            <li key={item.href} className={liClassName}>
                <Link href={item.href} className={linkClassName} onClick={onItemClick}>
                    {item.label}
                </Link>
            </li>
        ))}
    </>
);

const DesktopNav = ({isScrolled}: { isScrolled: boolean }) => (
    <nav className="hidden md:flex">
        <ul className="flex items-center space-x-8 text-base">
            <NavigationLinks
                linkClassName={`font-medium transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}
            />
        </ul>
    </nav>
);

const MenuToggleButton = ({isMenuOpen, toggleMenu, isScrolled}: {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    isScrolled: boolean;
}) => (
    <div className="md:hidden">
        <button onClick={toggleMenu} className={`transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
            {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </button>
    </div>
);

const MobileMenuPanel = ({isMenuOpen, isScrolled, closeMenu}: {
    isMenuOpen: boolean;
    isScrolled: boolean;
    closeMenu: () => void;
}) => {
    if (!isMenuOpen) return null;

    const navClasses = `absolute w-full md:hidden ${isScrolled ? 'bg-white/80 backdrop-blur-sm' : 'bg-black/50 backdrop-blur-sm'}`;
    const listClasses = `flex flex-col items-center divide-y ${isScrolled ? 'divide-gray-200/50' : 'divide-white/20'}`;
    const linkClassName = `block py-4 font-medium transition-colors ${isScrolled ? 'text-dark' : 'text-white'}`;

    return (
        <nav className={navClasses}>
            <ul className={listClasses}>
                <NavigationLinks
                    liClassName="w-full text-center"
                    linkClassName={linkClassName}
                    onItemClick={closeMenu}
                />
            </ul>
        </nav>
    );
};

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClassName = `sticky top-0 z-50 w-full transition-all duration-300 mb-12 ${
        isScrolled
            ? 'border-b border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
            : 'bg-transparent'
    } relative`;

    return (
        <header className={headerClassName}>
            <div className="container mx-auto flex h-20 max-w-5xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Music2 className="h-8 w-8 text-[#39C5BB]"/>
                    <div className={`${poppins.className} flex items-baseline`}>
                        <span
                            className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
                            HatsuneMiku
                        </span>
                        <span
                            className={`text-2xl font-light transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-300'}`}>
                            .me
                        </span>
                    </div>
                </Link>
                <DesktopNav isScrolled={isScrolled}/>
                <MenuToggleButton
                    isMenuOpen={isMenuOpen}
                    toggleMenu={() => setIsMenuOpen(prev => !prev)}
                    isScrolled={isScrolled}
                />
            </div>
            <MobileMenuPanel
                isMenuOpen={isMenuOpen}
                isScrolled={isScrolled}
                closeMenu={() => setIsMenuOpen(false)}
            />
        </header>
    );
}