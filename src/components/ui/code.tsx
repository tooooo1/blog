import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const InlineCode = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  return (
    <code
      className="bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-md text-[0.875em] font-mono text-yellow-800 dark:text-yellow-200 font-medium"
      {...props}
    />
  );
};

export const Pre = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) => {
  return (
    <pre
      className="my-6 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-5 overflow-x-auto text-sm leading-6 font-mono"
      {...props}
    />
  );
};
