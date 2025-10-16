import { getAllPosts, getPostBySlug, formatDate, calculateReadingTime } from "@/utils/getPosts";
import { CATEGORIES } from "@/types/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as UI from "@/components/ui";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const ogImage = `https://tooo1.vercel.app/api/og?title=${encodeURIComponent(
    post.title
  )}&description=${encodeURIComponent(post.description)}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const category = CATEGORIES[post.category];
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="w-full max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-[color:var(--muted)]">
        <Link href="/blog" className="hover:text-[color:var(--fg)]">
          blog
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/blog/category/${post.category}`}
              className="hover:text-[color:var(--fg)]"
            >
              {category.name}
            </Link>
          </>
        )}
      </nav>

      {/* Post Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          <span>·</span>
          <span>{readingTime}분</span>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Post Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
        <MDXRemote source={post.content} components={UI} />
      </div>

      {/* Back to Blog */}
      <footer className="pt-8 border-t border-[color:var(--border)]">
        <Link
          href="/blog"
          className="inline-block text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
        >
          ← 목록으로
        </Link>
      </footer>
    </article>
  );
}
