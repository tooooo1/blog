"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) {
      return;
    }

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3")
    ).filter((heading) => heading.id);

    if (headings.length === 0) {
      return;
    }

    const toc: TocItem[] = headings.map((heading) => ({
      id: heading.id,
      // 헤딩 안의 퍼머링크 앵커("#")는 목차 텍스트에서 제외한다.
      text: Array.from(heading.childNodes)
        .filter(
          (node) => !(node.nodeName === "A" && node.textContent?.trim() === "#")
        )
        .map((node) => node.textContent)
        .join(""),
      level: heading.tagName === "H3" ? 3 : 2,
    }));

    // IntersectionObserver's first callback fires asynchronously right after
    // observe() runs, so it doubles as the (deferred) initial TOC population.
    let initialized = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!initialized) {
          initialized = true;
          setItems(toc);
        }
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  if (items.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="목차"
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto text-sm"
    >
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              className={
                item.id === activeId
                  ? "block text-[color:var(--fg)]"
                  : "block text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
