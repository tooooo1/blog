import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const Img = (
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  return (
    <img
      className="rounded-xl my-8 w-full shadow-md"
      loading="lazy"
      {...props}
    />
  );
};
