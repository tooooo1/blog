import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "정충일",
    template: "%s | 정충일",
  },
  description: "프론트엔드 개발자의 기술 블로그",
  metadataBase: new URL("https://tooo1.vercel.app"),
  openGraph: {
    title: "정충일",
    description: "프론트엔드 개발자의 기술 블로그",
    siteName: "정충일",
    type: "website",
  },
  keywords: ["프론트엔드", "개발", "블로그", "JavaScript", "React"],
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
        <header className="flex justify-between items-center mb-4">
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
            <ul className="flex gap-1">
              <li>
                <Link
                  href="/blog"
                  className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
                >
                  blog
                </Link>
              </li>
              <li>
                <Link
                  href="/scribble"
                  className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
                >
                  scribble
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
                >
                  about
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center py-12">
          {children}
        </main>
        <footer className="mt-12 text-center text-xs text-[color:var(--muted)]">
          <div className="flex justify-center gap-4 mb-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/tooooo1"
              className="hover:text-[color:var(--fg)] transition-colors"
            >
              GitHub
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/tooo1"
              className="hover:text-[color:var(--fg)] transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <div>© {new Date().getFullYear()} 정충일</div>
        </footer>
      </body>
    </html>
  );
}
