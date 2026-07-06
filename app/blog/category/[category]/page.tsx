import { getPostsByCategory, getCategories } from "@/utils/getPosts";
import { CATEGORY_LABELS, getCategoryLabel } from "@/types/blog";
import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const activeCategories = getCategories();
  return activeCategories
    .filter((category) => CATEGORY_LABELS[category] !== undefined)
    .map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = getCategoryLabel(category);
  return {
    title: label.name,
    description: label.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const activeCategories = getCategories();
  const hasLabel = CATEGORY_LABELS[category] !== undefined;
  const isActive = activeCategories.includes(category);

  if (!hasLabel && !isActive) {
    notFound();
  }

  const label = getCategoryLabel(category);
  const posts = getPostsByCategory(category);

  return (
    <div className="w-full max-w-2xl px-4">
      <nav className="mb-6 text-sm text-[color:var(--muted)]">
        <Link
          href="/blog"
          transitionTypes={["nav-back"]}
          className="hover:text-[color:var(--fg)] transition-colors"
        >
          블로그
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[color:var(--fg)]">{label.name}</span>
      </nav>

      <PageHeader title={label.name} description={label.description} />

      <section>
        {posts.length > 0 ? (
          <div className="divide-y divide-[color:var(--border)]">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-[color:var(--muted)] text-center py-12">
            아직 작성된 글이 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}
