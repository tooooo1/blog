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
