export const metadata = {
  title: "소개",
  description: "정충일을 소개합니다.",
};

export default function AboutPage() {
  return (
    <article className="w-full max-w-2xl px-4">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>안녕하세요. 정충일입니다.</h1>
        <p>프론트엔드를 좋아합니다.</p>
      </div>
    </article>
  );
}
