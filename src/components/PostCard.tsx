import Link from "next/link";
import { Post } from "@/types/blog";
import { formatDate, calculateReadingTime } from "@/utils/getPosts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block py-6 hover:opacity-80 transition-opacity"
    >
      <article>
        <h2 className="text-xl font-medium mb-2">{post.title}</h2>
        <p className="text-[color:var(--muted)] text-sm mb-3">
          {post.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          <span>·</span>
          <span>{readingTime}분</span>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
