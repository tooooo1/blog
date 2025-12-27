import { getAllPosts } from "@/utils/getPosts";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="w-full max-w-2xl px-4">
      <section className="mb-16">
        <h1 className="text-2xl font-medium mb-2">정충일</h1>
        <p className="text-[color:var(--muted)]">
          프론트엔드 개발자 / 기술 블로그
        </p>
      </section>

      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">최근 글</h2>
            <Link
              href="/blog"
              className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
