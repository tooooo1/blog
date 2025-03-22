import type { BlockquoteHTMLAttributes, DetailedHTMLProps } from "react";

export function Blockquote(
  props: DetailedHTMLProps<
    BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >
) {
  return (
    <blockquote {...props} className="text-gray-600 pl-2 border-l-4">
      {props.children}
    </blockquote>
  );
}
