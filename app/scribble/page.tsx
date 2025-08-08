import { getScribbles, Scribble } from "@/utils/getScribbles";
import Link from "next/link";

export const metadata = {
  title: "낙서장",
  description: "생각나는 대로 자유롭게 적는 공간입니다.",
};

export default function ScribblePage() {
  const scribbles = getScribbles();

  return (
    <article className="w-full max-w-2xl">
      <h1 className="text-2xl font-medium">낙서장</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        짧게 남기는 생각들
      </p>

      {scribbles.length > 0 ? (
        <ul className="divide-y divide-[color:var(--border)]">
          {scribbles.map((scribble: Scribble) => (
            <li key={scribble.date} className="py-3 transition-colors">
              <Link
                href={`/scribble/${scribble.date}`}
                className="block rounded hover:bg-[color:var(--surface)] p-2 -mx-2"
              >
                <h3 className="text-lg font-medium">{scribble.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {scribble.formattedDate}
                </div>
                {scribble.description ? (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {scribble.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 p-4 bg-gray-50 dark:bg-[color:var(--surface)] rounded-md">
          아직 작성된 낙서가 없습니다.
        </p>
      )}
    </article>
  );
}
