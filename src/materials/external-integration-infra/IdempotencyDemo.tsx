"use client";

import { useId, useState } from "react";
import { ARRIVALS, ingest, type Strategy } from "./logic";
import "./path.css";

/*
  같은 도착열(가입 → 재시도 → 탈퇴 → 재가입)을 두 키 전략에 넣어 집계가 갈리는 걸 본다.
  요점은 "재시도를 거르는 키가 재가입까지 걸러 버릴 수 있다"이므로, 버려진 행이
  의도된 중복 제거인지 잘못 접힌 것인지를 라벨로 구분해야 한다.
*/

const STRATEGIES: { value: Strategy; label: string; hint: string }[] = [
  {
    value: "member",
    label: "hash(userId + eventType)",
    hint: "회원과 이벤트 종류로 만든 식별자",
  },
  { value: "event", label: "eventId", hint: "이벤트 발생 시점에 만든 식별자" },
];

interface Props {
  caption?: string;
}

export function IdempotencyDemo({ caption }: Props) {
  const [strategy, setStrategy] = useState<Strategy>("member");
  const groupName = useId();
  const { rows, tally } = ingest(strategy);
  const realJoin = ARRIVALS.filter((a) => !a.retry && a.kind === "가입").length;
  const realLeave = ARRIVALS.filter(
    (a) => !a.retry && a.kind === "탈퇴"
  ).length;
  const matches = tally.가입 === realJoin && tally.탈퇴 === realLeave;

  return (
    <figure className="m-path my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            중복을 거를 식별자를 무엇으로 만들까요
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {STRATEGIES.map(({ value, label, hint }) => (
              <label
                key={value}
                className="flex-1 min-w-[220px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--t-line)] has-[:checked]:bg-[color:var(--t-cell)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    value={value}
                    checked={strategy === value}
                    onChange={() => setStrategy(value)}
                    className="accent-[color:var(--t-line)]"
                  />
                  <code className="font-mono text-[13px] font-semibold bg-transparent px-0 text-[color:var(--fg)]">
                    {label}
                  </code>
                </span>
                <span className="block text-[12px] text-[color:var(--muted)] mt-1 pl-6">
                  {hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <ol className="list-none p-5 m-0 flex flex-col gap-1.5">
          {rows.map(({ arrival, key, stored, wrongDrop }, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg px-3 py-1.5"
            >
              <span className="text-[13px] text-[color:var(--fg)] shrink-0 sm:min-w-[176px]">
                {arrival.label}
              </span>
              <code className="font-mono text-[12px] bg-transparent px-0 text-[color:var(--muted)]">
                {key}
              </code>
              <span
                className={`ml-auto text-[12px] font-semibold whitespace-nowrap rounded-full px-2.5 py-0.5 ${
                  stored
                    ? "bg-[color:var(--t-ok-soft)] text-[color:var(--t-ok-text)]"
                    : wrongDrop
                      ? "bg-[color:var(--t-warn-soft)] text-[color:var(--t-warn-text)]"
                      : "bg-[color:var(--surface-2)] text-[color:var(--muted)]"
                }`}
              >
                {stored
                  ? "저장"
                  : wrongDrop
                    ? "버림 · 새 이벤트인데"
                    : "버림 · 재시도 걸러짐"}
              </span>
            </li>
          ))}
        </ol>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p className="text-[13px] text-[color:var(--fg)] m-0 leading-6">
            집계 가입 {tally.가입} · 탈퇴 {tally.탈퇴} — 실제 가입 {realJoin} ·
            탈퇴 {realLeave}{" "}
            <span
              className={`font-semibold ${
                matches
                  ? "text-[color:var(--t-ok-text)]"
                  : "text-[color:var(--t-warn-text)]"
              }`}
            >
              {matches ? "일치" : "가입 1건 유실"}
            </span>
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[color:var(--muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
