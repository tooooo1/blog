import type {
  DetailedHTMLProps,
  HTMLAttributes,
  LiHTMLAttributes,
} from "react";

export const Ul = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
) => {
  return (
    <ul
      className="my-5 space-y-3 list-disc pl-6 marker:text-gray-400 dark:marker:text-gray-500"
      {...props}
    />
  );
};

export const Ol = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>
) => {
  return (
    <ol
      className="my-5 space-y-3 list-decimal pl-6 marker:text-gray-400 dark:marker:text-gray-500"
      {...props}
    />
  );
};

export const Li = (
  props: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
) => {
  return (
    <li
      className="leading-[1.85] text-[color:var(--fg)]"
      {...props}
    />
  );
};
