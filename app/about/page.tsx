export const metadata = {
  title: "소개",
  description: "정충일을 소개합니다.",
};

export default function AboutPage() {
  return (
    <article className="w-full max-w-2xl px-4">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          안녕하세요. 정충일입니다.
        </h1>
        <p className="text-sm text-[color:var(--muted)] mt-1.5">
          프론트엔드를 좋아합니다.
        </p>
      </header>
    </article>
  );
}
