'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
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
        <nav className="flex items-center gap-1">
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
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 ml-1 text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="hidden dark:block"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="block dark:hidden"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
