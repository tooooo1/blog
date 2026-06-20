import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const P = (
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  return (
    <p
      className="leading-[1.85] mb-6 text-[color:var(--fg)] text-base"
      {...props}
    />
  );
};
