import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H1(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h1 className="text-4xl font-bold mb-8 mt-20 text-gray-900 dark:text-white leading-tight scroll-mt-20" {...props} />
  );
}
