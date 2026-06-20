import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H2(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h2
      className="text-3xl font-bold mb-6 mt-20 text-[color:var(--fg)] leading-tight scroll-mt-20"
      {...props}
    />
  );
}
