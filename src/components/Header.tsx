'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { ReadingProgress } from '@/components/ReadingProgress';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const NAV_ITEMS = [
  { href: '/blog', label: 'blog' },
  { href: '/scribble', label: 'scribble' },
  { href: '/about', label: 'about' },
] as const;

export function Header() {
  const pathname = usePathname();
  // 글 상세 페이지에서만 읽기 진행률 바를 띄운다 (카테고리 목록 제외)
  const showProgress = /^\/(blog|scribble)\/[^/]+$/.test(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const isDark = mounted && resolvedTheme === 'dark';

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
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
            className="theme-switch ml-1"
            onClick={toggleTheme}
          >
            <span className="theme-switch__star" aria-hidden="true" />
            <span className="theme-switch__star" aria-hidden="true" />
            <span className="theme-switch__knob" aria-hidden="true">
              <span className="theme-switch__sun" />
              <span className="theme-switch__moon" />
            </span>
          </button>
        </nav>
      </div>
      {showProgress && <ReadingProgress />}
    </header>
  );
}
