import { getAllPosts, getCategories, getPostsByCategory } from "@/utils/getPosts";
import { PostCard } from "@/components/PostCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/types/blog";

export const metadata = {
  title: "Blog",
  description: "기술 블로그",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="w-full max-w-2xl px-4">
      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium mb-4 text-[color:var(--muted)]">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((categoryId) => {
              const category = CATEGORIES[categoryId];
              if (!category) return null;

              const count = getPostsByCategory(categoryId).length;
              return (
                <CategoryBadge
                  key={categoryId}
                  id={categoryId}
                  name={category.name}
                  count={count}
                />
              );
            })}
          </div>
        </section>
      )}

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
