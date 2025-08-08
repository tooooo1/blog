import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const Img = (
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  return <img className="rounded-lg" {...props} />;
};
