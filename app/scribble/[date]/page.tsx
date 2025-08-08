import components from "@/components/ui";
import { getScribbles } from "@/utils/getScribbles";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ScribblePageProps {
  params: { date: string };
}

export const generateMetadata = async ({ params }: ScribblePageProps) => {
  const { date } = params;
  const scribbles = getScribbles();

  const scribble = scribbles.find((scribble) => scribble.date === date);
  const ogImage = scribble?.image || "/opengraph-image.jpg";

  return {
    title: scribble?.title || date,
    description: scribble?.description || "기록",
    openGraph: {
      publishedTime: scribble?.date,
      images: [ogImage],
    },
  };
};

export default function ScribblePage({ params }: ScribblePageProps) {
  const { date } = params;
  const scribbles = getScribbles();

  const scribble = scribbles.find((scribble) => scribble.date === date);

  if (!scribble) {
    return notFound();
  }

  return (
    <article className="w-full max-w-2xl pb-10">
      <header>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-medium">{scribble.title}</h1>
          <Link
            href="/scribble"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← 낙서장으로 돌아가기
          </Link>
        </div>
        <time
          dateTime={scribble.date}
          className="text-gray-500 dark:text-gray-400 text-sm block mb-4"
        >
          {scribble.formattedDate}
        </time>
        {scribble.description ? (
          <p className="text-gray-600 dark:text-gray-400 italic mb-4">
            {scribble.description}
          </p>
        ) : null}
        {scribble.image ? (
          <figure className="mb-6">
            <img
              src={scribble.image}
              alt={scribble.title}
              className="w-full h-auto rounded-lg"
            />
          </figure>
        ) : null}
      </header>
      <MDXRemote components={components} source={scribble.content} />
    </article>
  );
}
