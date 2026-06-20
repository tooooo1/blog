export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <span
        className="inline-block w-5 h-5 rounded-full border-2 border-[color:var(--border)] border-t-[color:var(--muted)] animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-[color:var(--muted)]">불러오는 중…</p>
    </div>
  );
}
