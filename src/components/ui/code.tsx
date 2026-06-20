import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const InlineCode = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  const { className, ...rest } = props;
  return <code className={className} {...rest} />;
};
