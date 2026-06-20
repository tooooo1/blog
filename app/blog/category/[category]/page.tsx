import { getPostsByCategory, getCategories } from "@/utils/getPosts";
import { CATEGORY_LABELS, getCategoryLabel } from "@/types/blog";
import { PostCard } from "@/components/PostCard";
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
      <nav className="mb-8 text-sm text-[color:var(--muted)]">
        <Link href="/blog" className="hover:text-[color:var(--fg)]">
          blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[color:var(--fg)]">{label.name}</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">{label.name}</h1>
        <p className="text-[color:var(--muted)]">{label.description}</p>
      </header>

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
