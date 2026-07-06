import { Post } from "@/types/blog";
import { formatDate, calculateReadingTime } from "@/utils/getPosts";
import { EntryCard } from "./EntryCard";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <EntryCard
      href={`/blog/${post.slug}`}
      title={post.title}
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
