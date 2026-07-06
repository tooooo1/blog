import Link from "next/link";
import { getAllPosts } from "@/utils/getPosts";
import { getScribbles } from "@/utils/getScribbles";
import { PostCard } from "@/components/PostCard";
import { ScribbleCard } from "@/components/ScribbleCard";
import { SITE_CONFIG } from "@/constants/site";

function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-forward"]}
      className="group text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const recentScribbles = getScribbles().slice(0, 2);

  return (
    <div className="w-full max-w-2xl px-4">
      <section className="mb-16">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">정충일</h1>
        <p className="text-[color:var(--muted)] leading-relaxed">
          프론트엔드 개발자. 배우고 만들며 남기는 기록들.
        </p>
        <div className="flex gap-4 mt-4 text-sm text-[color:var(--muted)]">
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
      </section>

      {recentPosts.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">최근 글</h2>
            <SectionLink href="/blog">전체 보기</SectionLink>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {recentScribbles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">최근 낙서</h2>
            <SectionLink href="/scribble">전체 보기</SectionLink>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {recentScribbles.map((scribble) => (
              <ScribbleCard key={scribble.date} scribble={scribble} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
