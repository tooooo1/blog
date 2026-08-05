import { SITE_CONFIG } from "@/constants/site";

const OG_TITLE = "만든 것을 측정하고, 측정한 것을 자동화합니다.";
const DESCRIPTION = "웰로의 프론트엔드를 만드는 정충일입니다.";

const ogImage = `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(OG_TITLE)}`;

export const metadata = {
  title: "소개",
  description: DESCRIPTION,
  authors: [{ name: SITE_CONFIG.author.name }],
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: OG_TITLE,
    description: DESCRIPTION,
    type: "profile",
    locale: "ko_KR",
    siteName: SITE_CONFIG.name,
    url: `${SITE_CONFIG.url}/about`,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: OG_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: DESCRIPTION,
    images: [ogImage],
  },
};

export default function AboutPage() {
  return (
    <article className="w-full max-w-2xl px-4">
      <header className="pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          정충일
        </h1>
        <p className="mt-3 text-lg text-[color:var(--muted)]">
          만든 것을 측정하고, 측정한 것을 자동화합니다.
        </p>
      </header>

      <div className="mt-6 leading-relaxed">
        <p>
          웰로의 프론트엔드를 혼자 맡고 있습니다. 전에는 카카오브레인에서
          인턴으로 일했습니다.
        </p>
        <p>좋은 코드를 좋아하고, 그 코드가 숫자를 바꾸는 순간을 더 좋아합니다.</p>
        <p>요즘은 코드를 스스로 고치는 파이프라인을 설계합니다.</p>
      </div>

      <div className="mt-6 leading-relaxed">
        <p className="font-medium">코드는 적게 · 측정은 먼저 · 실수는 구조로</p>
        <p className="mt-6 text-[color:var(--muted)]">
          재미있는 문제가 있다면 언제든 —{" "}
          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--link)] hover:underline"
          >
            GitHub
          </a>
          {" · "}
          <a
            href={SITE_CONFIG.author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--link)] hover:underline"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </article>
  );
}
