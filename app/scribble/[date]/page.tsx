import components from "@/components/ui";
import { getScribbles } from "@/utils/getScribbles";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};

interface ScribblePageProps {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  const scribbles = getScribbles();
  return scribbles.map((scribble) => ({
    date: scribble.date,
  }));
}

export const generateMetadata = async ({ params }: ScribblePageProps) => {
  const { date } = await params;
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

export default async function ScribblePage({ params }: ScribblePageProps) {
  const { date } = await params;
  const scribbles = getScribbles();

  const scribble = scribbles.find((scribble) => scribble.date === date);

  if (!scribble) {
    return notFound();
  }

  return (
    <article className="w-full max-w-2xl px-4 pb-10">
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
      <MDXRemote
        components={components}
        source={scribble.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [rehypePrettyCode, prettyCodeOptions],
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </article>
  );
}
