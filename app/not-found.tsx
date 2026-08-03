import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center py-20">
      <p className="text-5xl font-bold tracking-tight text-[color:var(--fg)]">
        404
      </p>
      <p className="mt-3 text-[color:var(--muted)]">
        페이지를 찾을 수 없어요
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 mt-8 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          ←
        </span>
        <span>홈으로</span>
      </Link>
    </div>
  );
}
