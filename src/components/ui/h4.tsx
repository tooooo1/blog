import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function H4(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h4
      className="text-lg font-bold mb-3 mt-8 text-gray-900 dark:text-white leading-tight scroll-mt-20 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"
      {...props}
    />
  );
}