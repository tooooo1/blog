"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sticky 헤더의 자식으로 렌더된다 — 헤더와 좌표계를 공유해야
  // 오버스크롤 바운스·모바일 주소창 수축 시에도 헤더에 붙어 움직인다.
  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-[color:var(--fg)]"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
