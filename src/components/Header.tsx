'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const NAV_ITEMS = [
  { href: '/blog', label: 'blog' },
  { href: '/scribble', label: 'scribble' },
  { href: '/about', label: 'about' },
] as const;

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      style={{ viewTransitionName: 'site-header' }}
      className="sticky top-0 z-50 bg-[color:var(--header-bg)] backdrop-blur-md border-b border-[color:var(--border)]"
    >
      <div className="max-w-2xl mx-auto px-4 flex justify-between items-center h-16">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-[color:var(--hover-bg)] transition-colors duration-200"
        >
          <Image
            src="/icon.svg"
            width={28}
            height={28}
            alt="home"
            unoptimized
            className="dark:invert w-7 h-7"
          />
        </Link>
        <nav className="flex items-center gap-1">
          <ul className="flex gap-2">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`inline-block px-4 py-2 text-sm rounded-full transition-colors duration-200 hover:bg-[color:var(--hover-bg)] ${
                      active
                        ? 'text-[color:var(--fg)]'
                        : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                    }`}
                  >
                    <span className="relative inline-block">
                      <span
                        className="invisible font-semibold"
                        aria-hidden="true"
                      >
                        {label}
                      </span>
                      <span
                        className={`absolute inset-0 ${active ? 'font-semibold' : ''}`}
                      >
                        {label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 ml-1 rounded-full text-[color:var(--muted)] transition-colors duration-200 hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--fg)]"
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
