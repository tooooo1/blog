import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H1(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return <h1 className="text-2xl font-bold mb-2" {...props} />;
}
