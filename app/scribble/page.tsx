import { getScribbles, Scribble } from "@/utils/getScribbles";
import Link from "next/link";

export const metadata = {
  title: "낙서장",
  description: "생각나는 대로 자유롭게 적는 공간입니다.",
};

export default function ScribblePage() {
  const scribbles = getScribbles();

  return (
    <article className="flex flex-col gap-4 w-full max-w-2xl">
      <h1 className="text-2xl font-medium">낙서장</h1>
      <h2 className="text-sm text-gray-500">
        생각나는 대로 자유롭게 적는 공간입니다.
      </h2>

      {scribbles.length > 0 ? (
        <ul className="space-y-3">
          {scribbles.map((scribble: Scribble) => (
            <li key={scribble.date} className="border-b border-gray-100 pb-3">
              <Link href={`/scribble/${scribble.date}`} className="block">
                <h3 className="text-lg font-medium text-blue-600 hover:underline">
                  {scribble.title}
                </h3>
                <div className="text-sm">{scribble.formattedDate}</div>
                {scribble.description ? (
                  <p className="mt-1 text-sm">{scribble.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 p-4 bg-gray-50 rounded-md">
          아직 작성된 낙서가 없습니다.
        </p>
      )}
    </article>
  );
}
