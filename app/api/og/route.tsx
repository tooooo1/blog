import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/constants/site";
import { getCategoryLabel } from "@/types/blog";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_MAX = 60;

/* 사이트 다크 토큰과 같은 값 (edge 런타임이라 CSS 변수를 못 읽는다).
   다크를 고른 이유: 메신저 미리보기는 이미지 밖에 제목·설명을 자기 배경색으로
   또 그린다. 흰 판은 그 텍스트 영역과 붙어 경계가 사라지는데, 어두운 판은
   라이트·다크 클라이언트 양쪽에서 "하나의 물체"로 읽힌다.
   대비 실측: fg 15.8:1, muted 7.7:1 (둘 다 AAA) */
const BG = "#0b0b0b";
const FG = "#e5e7eb";
const MUTED = "#9ca3af";
const RULE = "#374151";

const AVAIL = 1200 - 84 * 2;
const LADDER = [84, 76, 68, 62, 56, 52];

/** 제목 폭 = 이 값 × 폰트크기. 계수는 실제 렌더로 캘리브레이션했다 —
    "같은 빌드에서 sha256이 두 개 나왔다"는 16.36이고 66px에서 1080px로 1032px를 넘겨
    "나왔다"가 다음 줄로 내려갔다. 62px에서 1014px로 한 줄에 들어간다 */
const estUnits = (title: string) =>
  [...title].reduce((w, c) => w + (c === " " ? 0.26 : c.charCodeAt(0) < 128 ? 0.55 : 0.98), 0);

/** 한 줄에 들어가는 가장 큰 크기를 고른다. 52px에서도 한 줄이 안 되면 3줄까지 허용하는
    가장 큰 크기로 떨어진다 — 제목 길이 규칙을 사람이 지킬 필요가 없게 만드는 쪽이다 */
function titleSize(title: string) {
  const units = estUnits(title);
  return LADDER.find((size) => units * size <= AVAIL) ?? LADDER.find((size) => units * size <= AVAIL * 3) ?? 52;
}

/** Noto Sans KR Bold를 필요한 글자만 서브셋으로 받는다(약 5KB).
    UA를 비워야 woff2 대신 satori가 읽는 TrueType이 온다 */
async function loadBold(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "" } }
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:\/\/[^)]+)\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    // 폰트를 못 받아도 이미지는 나가야 한다 — satori 기본 폴백으로 렌더된다(굵기만 잃는다)
    return null;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const raw = params.get("title")?.trim() || SITE_CONFIG.name;
  const title = raw.length > TITLE_MAX ? `${raw.slice(0, TITLE_MAX - 1)}…` : raw;
  const category = params.get("category");
  const date = params.get("date");

  const meta = [
    category ? getCategoryLabel(category).name : null,
    date?.replaceAll("-", "."),
    SITE_CONFIG.author.name,
  ]
    .filter(Boolean)
    .join(" · ");

  const size = titleSize(title);
  const data = await loadBold(title + meta);

  try {
    return render(title, meta, size, data);
  } catch {
    // 깨진 이미지는 크롤러 캐시에 영구히 박힌다 — 500 대신 사이트명만 있는 판을 내보낸다
    return render(SITE_CONFIG.name, "", 84, null);
  }
}

function render(title: string, meta: string, size: number, data: ArrayBuffer | null) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "80px 84px",
          backgroundColor: BG,
          fontFamily: "KR",
        }}
      >
        {/* 제목을 어절 단위로 감싼다 — satori에는 word-break:keep-all이 없어서
            한 덩어리로 두면 "나왔다"가 "나 / 왔다"로 갈린다(실측). flexWrap이면
            줄바꿈 지점이 어절 사이로만 생긴다.
            ponytail: 한 어절이 한 줄보다 길면 넘친다. 한글 제목에서는 안 나오는 경우라 방치 */}
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
            // 어절 사이 공백은 marginRight로 준다 — satori는 gap 단축형을 무시한다(실측)
            <div key={i} style={{ display: "flex", marginRight: Math.round(size * 0.26) }}>
              {word}
            </div>
          ))}
        </div>
        {meta && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", width: "100%", height: 1, backgroundColor: RULE, marginBottom: 28 }} />
            <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.01em", color: MUTED }}>{meta}</div>
          </div>
        )}
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: data ? [{ name: "KR", data, weight: 700, style: "normal" }] : undefined,
      headers: {
        // 같은 쿼리 = 같은 이미지. 크롤러가 반복 요청해도 폰트 fetch까지 다시 타지 않게 한다
        "cache-control": "public, max-age=31536000, immutable",
      },
    }
  );
}
