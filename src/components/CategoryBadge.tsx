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
      transitionTypes={["nav-forward"]}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-[color:var(--border)] text-[color:var(--muted)] transition-colors duration-200 hover:text-[color:var(--fg)] hover:border-[color:var(--muted)] hover:bg-[color:var(--hover-bg)]"
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="text-xs opacity-60">{count}</span>
      )}
    </Link>
  );
}
