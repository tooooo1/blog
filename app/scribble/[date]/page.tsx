import components from "@/components/ui";
import { getScribbles } from "@/utils/getScribbles";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
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
    <article className="w-full max-w-2xl px-4">
      <header className="mb-12 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[color:var(--fg)] leading-tight">
          {scribble.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
          <time dateTime={scribble.date}>{scribble.formattedDate}</time>
          {scribble.description && (
            <>
              <span>·</span>
              <span>{scribble.description}</span>
            </>
          )}
        </div>
        {scribble.image ? (
          <figure className="mt-8">
            {/* Frontmatter images have unknown dimensions, so next/image cannot be used. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scribble.image}
              alt={scribble.title}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-lg"
            />
          </figure>
        ) : null}
      </header>
      <div className="pb-20">
        <MDXRemote
          components={components}
          source={scribble.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [rehypePrettyCode, prettyCodeOptions],
                rehypeSlug,
              ],
            },
          }}
        />
      </div>
      <footer className="py-12 border-t border-[color:var(--border)]">
        <Link
          href="/scribble"
          transitionTypes={["nav-back"]}
          className="group inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            ←
          </span>
          <span>목록으로</span>
        </Link>
      </footer>
    </article>
  );
}
