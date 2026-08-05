"use client";

import { useEffect, useId, useState } from "react";
import {
  BASELINE,
  VARIANT,
  REFERENCE,
  HEX_CHARS,
  TOTAL_BITS,
  changedIndexes,
  flippedBits,
  sha256Hex,
} from "./avalanche";
import "./parcel.css";

interface Props {
  caption?: string;
}

export function ContentAddressDemo({ caption }: Props) {
  const [text, setText] = useState(VARIANT);
  // hex는 항상 자기 원본 텍스트와 짝으로 갱신한다 — 입력과 결과가 어긋난 프레임을 없앤다
  const [result, setResult] = useState<{ source: string; hex: string }>({
    source: VARIANT,
    hex: REFERENCE.variantHex,
  });
  /* crypto.subtle은 보안 컨텍스트 전용이다. localhost http는 보안이지만 LAN IP http는 아니다.
     그런 환경에서는 편집을 끄고 기준쌍을 정적으로 보인다 — 크래시보다 낫다. */
  const [live, setLive] = useState(true);
  const inputId = useId();

  useEffect(() => {
    let cancelled = false;
    // 키입력마다 비동기 해싱이라 늦게 도착한 결과가 최신을 덮지 않게 막는다
    sha256Hex(text).then((result) => {
      if (cancelled) return;
      if (result === undefined) {
        setLive(false);
        return;
      }
      setResult({ source: text, hex: result });
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  const changed = changedIndexes(REFERENCE.baselineHex, result.hex);
  const bits = flippedBits(REFERENCE.baselineHex, result.hex);
  const sameAsBaseline = result.source === BASELINE;

  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <div className="p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <label
            htmlFor={inputId}
            className="block text-[13px] text-[color:var(--muted)] mb-3"
          >
            {live
              ? "한 글자만 바꾸면 아래 지문이 어떻게 변하는지 볼 수 있다"
              : "이 브라우저 환경에서는 실시간 해싱을 쓸 수 없어 기준쌍만 보인다"}
          </label>
          <input
            id={inputId}
            type="text"
            value={text}
            readOnly={!live}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="w-full font-mono text-[13px] rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] text-[color:var(--fg)] px-3 py-2"
          />
          <p className="text-[12px] text-[color:var(--muted)] m-0 mt-1.5">
            기준선: <code className="font-mono">{BASELINE}</code>
          </p>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <DigestRow label="기준선의 지문" hex={REFERENCE.baselineHex} />
          <DigestRow label="지금 입력의 지문" hex={result.hex} changed={changed} />
        </div>

        <div
          className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]"
          role="status"
          aria-live="polite"
        >
          {sameAsBaseline ? (
            <p className="text-[13px] text-[color:var(--fg)] m-0 leading-6">
              같은 내용 → 같은 주소. 내용 주소 저장소의 다른 절반이다.
            </p>
          ) : (
            <>
              <p className="text-[13px] text-[color:var(--fg)] m-0 leading-6">
                달라진 자리 <strong className="font-semibold">{changed.length}</strong>/
                {HEX_CHARS} · 뒤집힌 비트{" "}
                <strong className="font-semibold">{bits}</strong>/{TOTAL_BITS}
              </p>
              <p className="text-[13px] text-[color:var(--muted)] m-0 mt-1 leading-6">
                한 글자를 바꿨는데 절반쯤이 뒤집힌다. 조금 비슷한 주소라는 건
                없어서, digest 비교가 곧 내용 비교다.
              </p>
            </>
          )}
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

function DigestRow({
  label,
  hex,
  changed,
}: {
  label: string;
  hex: string;
  changed?: number[];
}) {
  const marks = changed ? new Set(changed) : undefined;
  return (
    <div>
      <div className="text-[12px] text-[color:var(--muted)] mb-1">{label}</div>
      <div className="font-mono text-[13px] leading-6 break-all text-[color:var(--fg)]">
        <span className="text-[color:var(--muted)]">sha256:</span>
        {[...hex].map((c, i) =>
          marks?.has(i) ? (
            // 색 단독으로 정보를 싣지 않는다 — 밑줄(모양) + 굵기 + 틴트 세 채널
            <span
              key={i}
              className="underline decoration-[color:var(--m-accent)] decoration-2 font-semibold bg-[color:var(--m-diff-soft)]"
            >
              {c}
            </span>
          ) : (
            <span key={i}>{c}</span>
          )
        )}
      </div>
    </div>
  );
}
