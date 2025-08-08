import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H3(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return <h3 className="text-lg font-medium mb-1" {...props} />;
}
