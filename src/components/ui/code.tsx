import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const InlineCode = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  return (
    <code
      className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-[0.875em] font-mono text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-600"
      {...props}
    />
  );
};

export const Pre = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) => {
  return (
    <pre
      className="my-8 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono border border-gray-200 dark:border-gray-600 shadow-sm"
      {...props}
    />
  );
};
