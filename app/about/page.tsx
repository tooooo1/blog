import { SITE_CONFIG } from "@/constants/site";
import { ProfileStructuredData } from "@/components/StructuredData";

const OG_TITLE = "웹과 앱을 만들고, 쓰이는지 살펴봅니다.";
const DESCRIPTION =
  "프론트엔드 개발자 정충일입니다. 웹과 앱을 개발하며, 사용자 반응과 지표를 보고 다음에 고칠 일을 찾습니다.";

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
      <ProfileStructuredData />
      <header className="pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          정충일
        </h1>
        <p className="mt-3 text-lg text-[color:var(--muted)]">{OG_TITLE}</p>
      </header>

      <div className="mt-6 space-y-4 leading-relaxed">
        <p>
          웰로에서 프론트엔드를 맡고 있습니다. 사용자 웹과 어드민, 제휴 서비스의
          웹뷰를 만들었고, React Native로 앱을 개발했습니다. 전에는
          카카오브레인에서 인턴으로 일했습니다.
        </p>
        <p>
          화면을 만들다 보면 API나 네트워크, 빌드와 배포까지 따라가야 할 때가
          있습니다. 문제가 생기면 코드와 요청 흐름을 따라 원인을 좁히고, 필요한
          부분은 동료와 함께 확인합니다. 그 과정에서 알게 된 것을 글로 남깁니다.
        </p>
        <p>
          만들고 나서는 사람들이 어떻게 쓰는지 살펴봅니다. 검색으로 얼마나
          찾아오는지, 기능을 쓰다가 어디서 막히는지, 어떤 오류가 나는지 보고
          다음에 고칠 일을 찾습니다.
        </p>
      </div>

      <div className="mt-6 leading-relaxed">
        <p>이곳에는 일하며 배운 것과, 아직 답을 찾고 있는 생각들을 씁니다.</p>
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
