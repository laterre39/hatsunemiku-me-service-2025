"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span
            className={`font-pacifico font-light text-3xl transition-colors hover:text-miku-pink ${
              isScrolled ? 'text-miku-dark' : 'text-white'
            }`}
          >
            HatsuneMiku.me
          </span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8 text-base">
            <li>
              <Link
                href="/about"
                className={`font-medium transition-colors hover:text-miku-turquoise ${
                  isScrolled ? 'text-miku-dark' : 'text-white'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/music"
                className={`font-medium transition-colors hover:text-miku-turquoise ${
                  isScrolled ? 'text-miku-dark' : 'text-white'
                }`}
              >
                Music
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className={`font-medium transition-colors hover:text-miku-turquoise ${
                  isScrolled ? 'text-miku-dark' : 'text-white'
                }`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className={`font-medium transition-colors hover:text-miku-turquoise ${
                  isScrolled ? 'text-miku-dark' : 'text-white'
                }`}
              >
                News
              </Link>
            </li>
          </ul>
        </nav>
        {/* Mobile Menu Button (to be implemented) */}
        <div className="md:hidden">
          <button
            className={`transition-colors ${
              isScrolled ? 'text-miku-dark' : 'text-white'
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}