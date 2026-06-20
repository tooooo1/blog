import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H3(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h3
      className="text-2xl font-bold mb-4 mt-12 text-[color:var(--fg)] leading-tight scroll-mt-20"
      {...props}
    />
  );
}
