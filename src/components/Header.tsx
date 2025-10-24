'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link
          href="/"
          className="p-2 -ml-2 hover:opacity-60 transition-opacity"
        >
          <img
            src="/icon.svg"
            width={28}
            height={28}
            alt="home"
            className="dark:invert"
          />
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link
                href="/blog"
                className={`inline-block px-4 py-2 text-sm transition-colors ${
                  isActive('/blog')
                    ? 'text-[color:var(--fg)] font-semibold'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                }`}
              >
                <span className="relative inline-block">
                  <span className="invisible font-semibold" aria-hidden="true">blog</span>
                  <span className={`absolute inset-0 ${isActive('/blog') ? 'font-semibold' : ''}`}>blog</span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/scribble"
                className={`inline-block px-4 py-2 text-sm transition-colors ${
                  isActive('/scribble')
                    ? 'text-[color:var(--fg)] font-semibold'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                }`}
              >
                <span className="relative inline-block">
                  <span className="invisible font-semibold" aria-hidden="true">scribble</span>
                  <span className={`absolute inset-0 ${isActive('/scribble') ? 'font-semibold' : ''}`}>scribble</span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`inline-block px-4 py-2 text-sm transition-colors ${
                  isActive('/about')
                    ? 'text-[color:var(--fg)] font-semibold'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                }`}
              >
                <span className="relative inline-block">
                  <span className="invisible font-semibold" aria-hidden="true">about</span>
                  <span className={`absolute inset-0 ${isActive('/about') ? 'font-semibold' : ''}`}>about</span>
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
