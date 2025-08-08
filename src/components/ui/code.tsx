import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const InlineCode = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  return (
    <code
      className="rounded bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-100"
      {...props}
    />
  );
};

export const Pre = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) => {
  return (
    <pre
      className="rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4 overflow-x-auto text-sm"
      {...props}
    />
  );
};
