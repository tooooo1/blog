import { getAllPosts, getPostBySlug, formatDate, calculateReadingTime } from "@/utils/getPosts";
import { CATEGORIES } from "@/types/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as UI from "@/components/ui";
import { BlogPostStructuredData } from "@/components/StructuredData";
import { SITE_CONFIG } from "@/constants/site";

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

  const ogImage = `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(
    post.title
  )}&description=${encodeURIComponent(post.description)}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: SITE_CONFIG.author.name }],
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [SITE_CONFIG.author.name],
      tags: post.tags,
      locale: "ko_KR",
      siteName: SITE_CONFIG.name,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
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
      creator: `@${SITE_CONFIG.author.name}`,
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
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt || new Date().toISOString()}
        updatedAt={post.updatedAt}
        slug={post.slug}
        tags={post.tags}
      />
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
        {/* Post Header */}
        <header className="mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-12">
            {post.publishedAt && (
              <time>{formatDate(post.publishedAt)}</time>
            )}
            <span>·</span>
            <span>{readingTime}분</span>
            {post.tags.length > 0 && (
              <>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-gray-400 dark:text-gray-600">
                    #{tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none pb-24">
          <MDXRemote source={post.content} components={UI} />
        </div>

        {/* Back to Blog */}
        <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors"
          >
            <span>←</span>
            <span>목록으로</span>
          </Link>
        </footer>
        </article>
      </div>
    </>
  );
}
