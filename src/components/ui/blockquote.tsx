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
      className="text-gray-600 dark:text-gray-300 pl-3 border-l-2 border-gray-200 dark:border-gray-700 italic"
    >
      {props.children}
    </blockquote>
  );
}
