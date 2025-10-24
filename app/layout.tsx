import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  authors: [{ name: SITE_CONFIG.author.name }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  keywords: [...SITE_CONFIG.keywords],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "ko_KR",
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      <head>
        <WebsiteStructuredData />
      </head>
      <body className="flex flex-col min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-[#0b0b0b]">
        <Header />
        <main className="flex-1 flex flex-col items-center py-12">
          {children}
        </main>
        <footer className="mt-12 text-center text-xs text-[color:var(--muted)] pb-8">
          <div className="flex justify-center gap-4 mb-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={SITE_CONFIG.author.github}
              className="hover:text-[color:var(--fg)] transition-colors"
            >
              GitHub
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={SITE_CONFIG.author.linkedin}
              className="hover:text-[color:var(--fg)] transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <div>© {new Date().getFullYear()} {SITE_CONFIG.author.name}</div>
        </footer>
      </body>
    </html>
  );
}
