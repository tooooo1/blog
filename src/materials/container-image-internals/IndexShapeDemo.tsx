"use client";

import { useId, useState } from "react";
import { TAG, shortDigest } from "./digests";
import {
  ATTESTATION_MANIFEST,
  CONSUMERS,
  IMAGE_MANIFEST,
  INDEX,
  PROVENANCE_LAYER,
} from "./ociIndex";
import "./parcel.css";

const OPTIONS = [
  {
    value: true,
    label: "기본값",
    hint: "--push는 증명서를 동봉한다 (buildx 0.11+)",
  },
  {
    value: false,
    label: "--provenance=false",
    hint: "동봉을 끄고 기존 모양으로 고정",
  },
] as const;

interface Props {
  caption?: string;
}

export function IndexShapeDemo({ caption }: Props) {
  const [bundled, setBundled] = useState(true);
  const groupName = useId();
  // 동봉을 끄면 태그는 목차가 아니라 manifest를 직접 가리킨다 (dev 검증 빌드에서 실측: exporting manifest == push digest)
  const target = bundled ? INDEX.withProvenance : IMAGE_MANIFEST;

  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            증명서를 동봉하는가
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <label
                key={String(o.value)}
                className="flex-1 min-w-[200px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--link)] has-[:checked]:bg-[color:var(--surface-2)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    checked={bundled === o.value}
                    onChange={() => setBundled(o.value)}
                    className="accent-[color:var(--link)]"
                  />
                  <code className="text-[13px] font-semibold text-[color:var(--fg)]">
                    {o.label}
                  </code>
                </span>
                <span className="block text-[12px] text-[color:var(--muted)] mt-1 pl-6">
                  {o.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="px-5 py-4 flex flex-col gap-1.5 overflow-x-auto">
          <Node
            label="tag"
            value={TAG}
            note="여기는 안 변한다"
            pill
          />
          <Arrow />
          {bundled ? (
            <>
              <Node
                label="index"
                value={target.digest}
                size={target.size}
                note="태그가 이제 이걸 가리킨다"
                digest
                changed
              />
              <Arrow indent />
              <Node
                label="manifest"
                value={IMAGE_MANIFEST.digest}
                size={IMAGE_MANIFEST.size}
                note="linux/amd64 · 그대로"
                digest
                indent
              />
              <Node
                label="증명서"
                value={ATTESTATION_MANIFEST.digest}
                size={ATTESTATION_MANIFEST.size}
                note="unknown/unknown으로 위장"
                digest
                changed
                indent
              />
            </>
          ) : (
            <Node
              label="manifest"
              value={IMAGE_MANIFEST.digest}
              size={IMAGE_MANIFEST.size}
              note="태그가 곧바로 가리킨다"
              digest
            />
          )}
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p className="text-[13px] text-[color:var(--fg)] m-0 leading-6">
            태그가 가리키는 digest{" "}
            <code className="font-mono">{shortDigest(target.digest)}</code>
          </p>
          <ul className="list-none p-0 m-0 mt-2 flex flex-col gap-1">
            {CONSUMERS.map((c) => {
              const broken = bundled && !c.handlesIndex;
              return (
                <li
                  key={c.name}
                  className="flex flex-wrap items-baseline gap-x-2 text-[12px]"
                >
                  <span
                    className={
                      broken
                        ? "text-[color:var(--m-accent-text)] font-semibold"
                        : "text-[color:var(--muted)]"
                    }
                  >
                    {/* 색 단독으로 정보를 싣지 않는다 — 기호 + 글자 라벨 */}
                    {broken ? "≠ 걸린다" : "= 무영향"}
                  </span>
                  <span className="text-[color:var(--fg)]">{c.name}</span>
                  {/* note는 index가 있을 때의 결과를 말한다 — 없는 상태에서 보이면 어긋난다 */}
                  {bundled && (
                    <span className="text-[color:var(--muted)]">{c.note}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-[13px] text-[color:var(--muted)] m-0 mt-2 leading-6">
            {bundled
              ? "빌드는 성공하고 배포도 안 깨진다. 바뀐 건 태그가 가리키는 대상의 모양뿐이라, 에러 없이 조용히 통과한다."
              : "기존 --load 시절과 같은 모양이다. 증명서의 소비자가 없다면 이쪽으로 고정하는 게 맞다."}
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

function Arrow({ indent }: { indent?: boolean }) {
  return (
    <div
      className={`text-[color:var(--muted)] text-[12px] leading-none ${indent ? "pl-7" : "pl-3"}`}
      aria-hidden="true"
    >
      ↓
    </div>
  );
}

function Node({
  label,
  value,
  size,
  note,
  digest,
  pill,
  indent,
  changed,
}: {
  label: string;
  value: string;
  size?: number;
  note: string;
  digest?: boolean;
  pill?: boolean;
  indent?: boolean;
  changed?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg px-2 py-1.5 ${
        changed ? "bg-[color:var(--surface-2)]" : ""
      } ${indent ? "ml-4" : ""}`}
    >
      <span className="text-[13px] font-semibold text-[color:var(--fg)] min-w-[70px] shrink-0">
        {label}
      </span>
      <code
        className={`font-mono text-[12px] shrink-0 text-[color:var(--fg)] ${
          pill
            ? "rounded-full border border-[color:var(--border)] bg-[color:var(--m-stamp)] px-2 py-0.5"
            : ""
        }`}
        title={digest ? value : undefined}
      >
        {digest ? (
          <>
            <span aria-hidden="true">{shortDigest(value)}</span>
            <span className="sr-only">{value}</span>
          </>
        ) : (
          value
        )}
      </code>
      {size !== undefined && (
        <span className="text-[12px] text-[color:var(--muted)] shrink-0">{size}B</span>
      )}
      <span className="text-[12px] text-[color:var(--muted)]">{note}</span>
    </div>
  );
}
