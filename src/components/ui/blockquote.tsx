import type { BlockquoteHTMLAttributes, DetailedHTMLProps } from "react";

export function Blockquote(
  props: DetailedHTMLProps<
    BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >
) {
  return (
    <blockquote
      {...props}
      className="my-8 text-[color:var(--muted)] pl-4 py-1 border-l-4 border-[color:var(--border)] leading-[1.85]"
    >
      {props.children}
    </blockquote>
  );
}
