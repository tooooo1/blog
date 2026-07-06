import { getAllPosts, getCategories, getPostsByCategory } from "@/utils/getPosts";
import { PostCard } from "@/components/PostCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { PageHeader } from "@/components/PageHeader";
import { getCategoryLabel } from "@/types/blog";

export const metadata = {
  title: "Blog",
  description: "기술 블로그",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="w-full max-w-2xl px-4">
      <PageHeader title="블로그" description="배우고 만들며 남기는 기술 기록" />

      {categories.length > 0 && (
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((categoryId) => {
              const label = getCategoryLabel(categoryId);
              const count = getPostsByCategory(categoryId).length;
              return (
                <CategoryBadge
                  key={categoryId}
                  id={categoryId}
                  name={label.name}
                  count={count}
                />
              );
            })}
          </div>
        </section>
      )}

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
