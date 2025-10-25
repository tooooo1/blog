import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const P = (
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  return (
    <p
      className="leading-7 mb-6 text-gray-800 dark:text-gray-200 text-base"
      {...props}
    />
  );
};
