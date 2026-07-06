import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const Img = ({
  alt,
  ...props
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  return (
    // MDX images have unknown dimensions, so next/image cannot be used here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-xl my-8 w-full shadow-md"
      loading="lazy"
      decoding="async"
      alt={alt ?? ""}
      {...props}
    />
  );
};
