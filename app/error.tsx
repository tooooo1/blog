"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center"
    >
      <p className="text-4xl" aria-hidden="true">
        😔
      </p>
      <h1 className="text-xl font-semibold text-[color:var(--fg)]">
        문제가 발생했어요
      </h1>
      <p className="text-sm text-[color:var(--muted)] max-w-xs leading-relaxed">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-md bg-[color:var(--fg)] text-[color:var(--bg)] hover:opacity-80 transition-opacity"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-4 py-2 text-sm rounded-md border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
