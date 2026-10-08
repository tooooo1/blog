import type { ReactNode } from "react";

interface HintProps {
  /** 상자 위에 붙는 질문 한 줄 */
  label: string;
  children: ReactNode;
}

/*
  본문 흐름 옆에서 "왜?"에 답하는 상자. 코드 블록과 같은 면 위에 바로 보인다 —
  눌러야 열리는 말풍선은 독자가 그냥 지나쳐서 쓰지 않는다.
*/
export function Hint({ label, children }: HintProps) {
  return (
    <aside className="my-6 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--code-bg)] px-5 py-4">
      <p className="mb-1 text-[13px] font-semibold text-[color:var(--muted)]">
        {label}
      </p>
      <div className="text-[15px] leading-7 text-[color:var(--fg)] [&_p]:m-0">
        {children}
      </div>
    </aside>
  );
}
