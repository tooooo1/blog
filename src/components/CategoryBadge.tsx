import Link from "next/link";

interface CategoryBadgeProps {
  id: string;
  name: string;
  count?: number;
}

export function CategoryBadge({ id, name, count }: CategoryBadgeProps) {
  return (
    <Link
      href={`/blog/category/${id}`}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-[color:var(--code-bg)] hover:opacity-70 transition-opacity"
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="text-xs opacity-60">{count}</span>
      )}
    </Link>
  );
}
