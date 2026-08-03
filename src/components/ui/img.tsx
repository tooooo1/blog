"use client";

import { useRef } from "react";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const Img = ({
  alt,
  ...props
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-xl w-full shadow-md cursor-zoom-in"
        loading="lazy"
        decoding="async"
        alt={alt ?? ""}
        onClick={() => dialogRef.current?.showModal()}
        {...props}
      />
      {alt && (
        <figcaption className="text-sm text-[color:var(--muted)] text-center mt-2">
          {alt}
        </figcaption>
      )}
      <dialog
        ref={dialogRef}
        className="m-auto bg-transparent p-0 border-none max-w-none max-h-none backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={props.src}
          alt={alt ?? ""}
          className="max-w-[92vw] max-h-[90vh] object-contain"
        />
      </dialog>
    </figure>
  );
};
