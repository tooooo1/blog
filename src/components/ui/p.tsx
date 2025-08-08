import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const P = (
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  return (
    <p className="leading-7 text-gray-700 dark:text-gray-300" {...props} />
  );
};
