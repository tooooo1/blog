import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H4(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h4
      className="text-lg font-bold mb-3 mt-8 text-[color:var(--fg)] leading-tight scroll-mt-20"
      {...props}
    />
  );
}