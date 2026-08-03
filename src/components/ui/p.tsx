import { Children, isValidElement } from "react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { Img } from "./img";

export const P = ({
  children,
  ...props
}: DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>) => {
  const childArray = Children.toArray(children);
  const isImageOnly =
    childArray.length === 1 &&
    isValidElement(childArray[0]) &&
    childArray[0].type === Img;

  // MDX wraps standalone images in a <p>, but Img renders a <figure>,
  // and <p><figure> is invalid HTML — skip the wrapper in that case.
  if (isImageOnly) {
    return <>{children}</>;
  }

  return (
    <p
      className="leading-[1.85] mb-6 text-[color:var(--fg)] text-base"
      {...props}
    >
      {children}
    </p>
  );
};
