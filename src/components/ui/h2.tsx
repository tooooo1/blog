import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H2(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return <h2 className="text-xl font-semibold mb-1" {...props} />;
}
