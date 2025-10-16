import { getPostsByCategory } from "@/utils/getPosts";
import { CATEGORIES } from "@/types/blog";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = CATEGORIES[params.category];
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES[params.category];

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(params.category);

  return (
    <div className="w-full max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-[color:var(--muted)]">
        <Link href="/blog" className="hover:text-[color:var(--fg)]">
          blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[color:var(--fg)]">{category.name}</span>
      </nav>

      {/* Category Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-[color:var(--muted)]">{category.description}</p>
      </header>

      {/* Posts */}
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
