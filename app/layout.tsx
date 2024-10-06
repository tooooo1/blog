import "./globals.css";

import { GlobalProvider } from "@/components/GlobalProvider";

import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "blog 퉁이리",
  description: "정충일",
  metadataBase: new URL("https://tooo1.vercel.app"),
  openGraph: {
    title: "blog 퉁이리",
    siteName: "정충일",
  },
  keywords: ["블로그", "개발", "퉁이리", "정충일"],
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
      <body className="p-2">
        <header className="flex justify-between items-center">
          <h1>
            <Link href="/" className="box-border">
              <img src="./icon.svg" width={30} />
            </Link>
          </h1>
          <nav>
            <ul className="flex gap-1">
              <li>
                <Link href="/about">about</Link>
              </li>
              <li>
                <a target="_blank" href="https://www.linkedin.com/in/tooo1">
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-col min-h-screen justify-center items-center">
          <GlobalProvider>{children}</GlobalProvider>
        </main>
        <footer className="text-center text-gray-400 text-xs">
          blog. 퉁이리
          <a target="_blank" href="https://github.com/tooooo1" className="ml-2">
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
