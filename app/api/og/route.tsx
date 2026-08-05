import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/constants/site";
import { getCategoryLabel } from "@/types/blog";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_MAX = 60;
const PADDING_X = 84;
const AVAIL = WIDTH - PADDING_X * 2;
const LADDER = [84, 76, 68, 62, 56, 52];

const BG = "#0b0b0b";
const FG = "#e5e7eb";
const MUTED = "#9ca3af";
const RULE = "#374151";

const estUnits = (title: string) =>
  [...title].reduce(
    (w, c) => w + (c === " " ? 0.26 : c.charCodeAt(0) < 128 ? 0.55 : 0.98),
    0
  );

function titleSize(title: string) {
  const units = estUnits(title);
  return (
    LADDER.find((size) => units * size <= AVAIL) ??
    LADDER.find((size) => units * size <= AVAIL * 3) ??
    52
  );
}

async function loadBold(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "" } }
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:\/\/[^)]+)\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const raw = params.get("title")?.trim() || SITE_CONFIG.name;
  const title =
    raw.length > TITLE_MAX ? `${raw.slice(0, TITLE_MAX - 1)}…` : raw;
  const category = params.get("category");
  const date = params.get("date");

  const meta = [
    category ? getCategoryLabel(category).name : null,
    date?.replaceAll("-", "."),
    SITE_CONFIG.author.name,
  ]
    .filter(Boolean)
    .join(" · ");

  const data = await loadBold(title + meta);

  try {
    return render(title, meta, titleSize(title), data);
  } catch {
    return render(SITE_CONFIG.name, "", 84, null);
  }
}

function render(
  title: string,
  meta: string,
  size: number,
  data: ArrayBuffer | null
) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: `80px ${PADDING_X}px`,
        backgroundColor: BG,
        fontFamily: "KR",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexWrap: "wrap",
          alignItems: "center",
          alignContent: "center",
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
          color: FG,
        }}
      >
        {title.split(" ").map((word, i) => (
          <div
            key={i}
            style={{ display: "flex", marginRight: Math.round(size * 0.26) }}
          >
            {word}
          </div>
        ))}
      </div>
      {meta && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              backgroundColor: RULE,
              marginBottom: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: "-0.01em",
              color: MUTED,
            }}
          >
            {meta}
          </div>
        </div>
      )}
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: data
        ? [{ name: "KR", data, weight: 700, style: "normal" }]
        : undefined,
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    }
  );
}
