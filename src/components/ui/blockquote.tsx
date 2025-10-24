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
      className="my-8 text-gray-600 dark:text-gray-400 pl-4 py-1 border-l-4 border-gray-300 dark:border-gray-700 leading-relaxed"
    >
      {props.children}
    </blockquote>
  );
}
