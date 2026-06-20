"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          fontFamily: "sans-serif",
          background: "#ffffff",
          color: "#1f2937",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p style={{ fontSize: "2.5rem", margin: 0 }} aria-hidden="true">
          😔
        </p>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
          오류가 발생했어요
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            margin: 0,
            maxWidth: "20rem",
            lineHeight: 1.6,
          }}
        >
          페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            borderRadius: "0.375rem",
            border: "none",
            background: "#1f2937",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
