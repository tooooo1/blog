"use client";

import { useId, useState } from "react";
import { PROBES, STAGES, stageState } from "./logic";
import "./path.css";

/*
  에러 문구를 골라 요청이 어디까지 갔는지 본다. 판정은 단계 알약의 색과 라벨이
  전부 싣는다 — 초록 = 통과 확인, 빨강 = 여기부터 의심, 회색 = 아직 못 감.
  아래 설명 푸터는 두지 않는다.
*/

interface Props {
  caption?: string;
}

function DownArrow() {
  return (
    <svg
      aria-hidden
      width="12"
      height="14"
      viewBox="0 0 12 14"
      className="mx-auto my-0.5 block"
    >
      <path
        d="M6 1v9M2 7.5L6 12l4-4.5"
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PathProbeDemo({ caption }: Props) {
  const [selected, setSelected] = useState(PROBES[1].key);
  const groupName = useId();
  const probe = PROBES.find((p) => p.key === selected)!;

  return (
    <figure className="m-path my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            API 호출이 이렇게 실패했습니다
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {PROBES.map(({ key, label }) => (
              <label
                key={key}
                className="flex-1 min-w-[180px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--t-line)] has-[:checked]:bg-[color:var(--t-cell)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    value={key}
                    checked={selected === key}
                    onChange={() => setSelected(key)}
                    className="accent-[color:var(--t-line)]"
                  />
                  <code className="font-mono text-[12px] font-semibold bg-transparent px-0 text-[color:var(--fg)]">
                    {label}
                  </code>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="p-5 flex flex-col">
          {STAGES.map((stage, i) => {
            const state = stageState(probe, i);
            return (
              <div key={stage}>
                {i > 0 && <DownArrow />}
                <div
                  className={`flex items-baseline gap-3 rounded-full px-4 py-1.5 ${
                    state === "passed"
                      ? "bg-[color:var(--t-ok-soft)]"
                      : state === "suspect"
                        ? "bg-[color:var(--t-warn-soft)]"
                        : "border border-[color:var(--border)]"
                  }`}
                >
                  <span
                    className={`text-[13px] ${
                      state === "unreached"
                        ? "text-[color:var(--muted)]"
                        : "font-semibold text-[color:var(--fg)]"
                    }`}
                  >
                    {stage}
                  </span>
                  <span
                    className={`ml-auto text-[12px] whitespace-nowrap ${
                      state === "passed"
                        ? "font-semibold text-[color:var(--t-ok-text)]"
                        : state === "suspect"
                          ? "font-semibold text-[color:var(--t-warn-text)]"
                          : "text-[color:var(--muted)]"
                    }`}
                  >
                    {state === "passed"
                      ? "통과 확인"
                      : state === "suspect"
                        ? i === probe.suspectFrom
                          ? "여기부터 본다"
                          : "의심 구간"
                        : "아직 못 감"}
                  </span>
                </div>
              </div>
            );
          })}
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
