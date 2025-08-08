import "./globals.css";

import { GlobalProvider } from "@/components/GlobalProvider";

import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "정충일 블로그",
  description: "정충일의 기록",
  metadataBase: new URL("https://tooo1.vercel.app"),
  openGraph: {
    title: "정충일 블로그",
    siteName: "정충일 블로그",
  },
  keywords: ["블로그", "개발", "정충일"],
};

export const viewport: Viewport = {
  themeColor: "transparent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="p-4 flex flex-col min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-[#0b0b0b]">
        <header className="flex justify-between items-center">
          <h1>
            <Link href="/" aria-label="홈" className="p-2 inline-flex">
              <img
                src="/icon.svg"
                width={30}
                height={30}
                alt="사이트 아이콘"
                className="dark:invert"
              />
            </Link>
          </h1>
          <nav aria-label="주요 메뉴">
            <ul className="flex gap-2">
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  href="/scribble"
                  className="px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                >
                  낙서장
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center">
          <GlobalProvider>{children}</GlobalProvider>
        </main>
        <footer className="mt-6 text-center text-gray-400 dark:text-gray-500 text-xs">
          <div className="flex justify-center gap-3 mb-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/tooooo1"
              className="px-3 py-2 text-gray-600 dark:text-gray-300"
            >
              GitHub
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/tooo1"
              className="px-3 py-2 text-gray-600 dark:text-gray-300"
            >
              LinkedIn
            </a>
          </div>
          <div>© 정충일</div>
        </footer>
      </body>
    </html>
  );
}
