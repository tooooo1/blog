import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/constants/site";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Blog Post";
    const description = searchParams.get("description") || "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            padding: "80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.2,
                maxWidth: "90%",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 28,
                  // 사이트 --muted와 같은 값으로 유지한다 (edge 런타임이라 CSS 변수를 못 읽는다)
                  color: "#5f6873",
                  lineHeight: 1.4,
                  maxWidth: "80%",
                }}
              >
                {description}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 24,
              color: "#9ca3af",
            }}
          >
            <div>{SITE_CONFIG.author.name}</div>
            <div style={{ fontSize: 16 }}>•</div>
            <div style={{ fontSize: 20 }}>{SITE_CONFIG.name}</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
