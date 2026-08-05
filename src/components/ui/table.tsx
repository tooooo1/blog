import type {
  DetailedHTMLProps,
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

/* remark-gfm은 정렬 표(`| :--- | ---: |`)를 style={{textAlign}}으로 넘긴다.
   props를 흘려보내지 않으면 정렬이 조용히 사라진다. */

export function Table({
  className,
  ...props
}: DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]" {...props} />
    </div>
  );
}

export function Thead(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >
) {
  return <thead {...props} />;
}

export function Tbody(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  >
) {
  return <tbody {...props} />;
}

export function Tr({
  className,
  ...props
}: DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>) {
  return (
    <tr
      className="border-b border-[color:var(--border)] last:border-0"
      {...props}
    />
  );
}

export function Th({
  className,
  ...props
}: DetailedHTMLProps<
  ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>) {
  return (
    <th
      className="text-left align-top px-3 py-2 font-semibold text-[color:var(--fg)] whitespace-nowrap bg-[color:var(--surface)]"
      {...props}
    />
  );
}

export function Td({
  className,
  ...props
}: DetailedHTMLProps<
  TdHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>) {
  return (
    <td
      className="align-top px-3 py-2 text-[color:var(--muted)] leading-7"
      {...props}
    />
  );
}
