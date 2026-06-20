import { getAllPosts, getPostBySlug, formatDate, calculateReadingTime } from "@/utils/getPosts";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  H1, H2, H3, H4, P, Blockquote, InlineCode, Ul, Ol, Li, Img, Anchor, Hr,
  Callout, AhaPoint, InfoBox, Warning, Tip, SourceLink, Timeline, TimelineItem,
} from "@/components/ui";
import mdxComponents from "@/components/ui/mdx-components";
import { BlogPostStructuredData } from "@/components/StructuredData";
import { SITE_CONFIG } from "@/constants/site";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
        <header className="mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-[color:var(--fg)] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)] mb-12">
            {post.publishedAt && (
              <time>{formatDate(post.publishedAt)}</time>
            )}
            <span>·</span>
            <span>{readingTime}분</span>
            {post.tags.length > 0 && (
              <>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[color:var(--muted)]">
                    #{tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none pb-24">
          <MDXRemote
            source={post.content}
            components={{
              ...mdxComponents,
              H1, H2, H3, H4, P, Blockquote, InlineCode, Ul, Ol, Li, Img, Anchor, Hr,
              Callout, AhaPoint, InfoBox, Warning, Tip, SourceLink, Timeline, TimelineItem,
            }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode, prettyCodeOptions],
                  rehypeSlug,
                ],
              },
            }}
          />
        </div>

        <footer className="py-12 border-t border-[color:var(--border)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
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
