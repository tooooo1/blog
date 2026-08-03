import { Post } from "@/types/blog";
import {
  formatDate,
  calculateReadingTime,
  isRecentlyPublished,
} from "@/utils/getPosts";
import { EntryCard } from "./EntryCard";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const isNew = !!post.publishedAt && isRecentlyPublished(post.publishedAt);

  return (
    <EntryCard
      href={`/blog/${post.slug}`}
      title={
        <>
          {post.title}
          {isNew && (
            <span className="ml-2 text-[10px] font-medium tracking-wide text-[color:var(--fg)] border border-[color:var(--border)] rounded-full px-1.5 py-px align-middle">
              NEW
            </span>
          )}
        </>
      }
      description={post.description}
      meta={
        <>
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          <span>·</span>
          <span>{calculateReadingTime(post.content)}분</span>
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
        </>
      }
    />
  );
}
