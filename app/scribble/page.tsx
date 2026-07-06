import { getScribbles } from "@/utils/getScribbles";
import { ScribbleCard } from "@/components/ScribbleCard";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "낙서장",
  description: "생각나는 대로 자유롭게 적는 공간입니다.",
};

export default function ScribblePage() {
  const scribbles = getScribbles();

  return (
    <div className="w-full max-w-2xl px-4">
      <PageHeader title="낙서장" description="짧게 남기는 생각들" />

      <section>
        {scribbles.length > 0 ? (
          <div className="divide-y divide-[color:var(--border)]">
            {scribbles.map((scribble) => (
              <ScribbleCard key={scribble.date} scribble={scribble} />
            ))}
          </div>
        ) : (
          <p className="text-[color:var(--muted)] text-center py-12">
            아직 작성된 낙서가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}
