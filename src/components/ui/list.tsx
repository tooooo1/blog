import type {
  DetailedHTMLProps,
  HTMLAttributes,
  LiHTMLAttributes,
} from "react";

export const Ul = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
) => {
  return <ul className="my-3 list-disc pl-5" {...props} />;
};

export const Ol = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>
) => {
  return <ol className="my-3 list-decimal pl-5" {...props} />;
};

export const Li = (
  props: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
) => {
  return <li className="leading-7" {...props} />;
};
