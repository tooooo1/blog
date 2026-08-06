"use client";

import { useId, useState } from "react";
import { CONFIG, LAYERS, MANIFEST_DIGEST, TAG, shortDigest } from "./digests";
import "./parcel.css";

type Path = "push" | "load";

const PATHS: { value: Path; label: string; hint: string }[] = [
  { value: "push", label: "--push", hint: "BuildKit이 레지스트리로 바로 올림" },
  { value: "load", label: "--load", hint: "데몬에 배달 → 데몬이 다시 압축해서 올림" },
];

interface Props {
  caption?: string;
}

export function DigestCascadeDemo({ caption }: Props) {
  const [path, setPath] = useState<Path>("push");
  const groupName = useId();
  const changed = path === "load";

  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            빌드 결과물을 어디로 내보내는가
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {PATHS.map(({ value, label, hint }) => (
              <label
                key={value}
                className="flex-1 min-w-[220px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--link)] has-[:checked]:bg-[color:var(--surface-2)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    value={value}
                    checked={path === value}
                    onChange={() => setPath(value)}
                    className="accent-[color:var(--link)]"
                  />
                  <code className="text-[13px] font-semibold text-[color:var(--fg)]">
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

        <div className="px-5 py-4 flex flex-col gap-1.5">
          <Row label="tag" value={TAG} pill />
          <Arrow />
          <Row
            label="manifest"
            value={MANIFEST_DIGEST[path]}
            digest
            changed={changed}
          />
          <Arrow />
          <Row
            label="config"
            value={CONFIG.digest}
            digest
            indent
          />
          {LAYERS.map((layer) => (
            <Row
              key={layer.name}
              label={`layer · ${layer.name.replace(/\s*\(.*\)$/, "")}`}
              value={layer[path].digest}
              digest
              changed={changed}
              indent
            />
          ))}
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p className="text-[13px] text-[color:var(--fg)] m-0 leading-6">
            압축하기 전 tar 내용의 digest는{" "}
            <strong className="font-semibold">두 경로에서 완전히 같아요</strong>
          </p>
          <ul className="list-none p-0 m-0 mt-1.5 flex flex-col gap-0.5">
            {LAYERS.map((layer) => (
              <li
                key={layer.name}
                className="font-mono text-[12px] text-[color:var(--muted)]"
                title={layer.uncompressed}
              >
                {shortDigest(layer.uncompressed)}
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-[color:var(--muted)] m-0 mt-2 leading-6">
            {changed
              ? "파일 내용은 그대로라 컨테이너를 띄우면 같은 앱이 돕니다. 달라진 건 압축한 파일의 digest뿐이에요."
              : "BuildKit이 만든 바이트가 그대로 올라가니까 빌드 로그의 digest와 레지스트리의 digest가 일치합니다."}
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

function Arrow() {
  return (
    <div className="pl-3 text-[color:var(--muted)] text-[12px] leading-none" aria-hidden="true">
      ↓
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
  /** value가 digest면 잘라서 보여주고 전체값은 title에 담는다 */
  digest?: boolean;
  /** 가변 포인터(tag)는 색이 아니라 pill 모양으로 구분한다 — 링크색을 쓰면 링크로 읽힌다 */
  pill?: boolean;
  indent?: boolean;
  changed?: boolean;
}

function Row({ label, value, digest, pill, indent, changed }: RowProps) {
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg px-2 py-1.5 ${
        changed ? "bg-[color:var(--surface-2)]" : ""
      } ${indent ? "ml-4" : ""}`}
    >
      <span className="text-[13px] font-semibold text-[color:var(--fg)] sm:min-w-[92px] shrink-0">
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
      <span
        className={`ml-auto text-[12px] whitespace-nowrap ${
          changed
            ? "text-[color:var(--m-accent-text)] font-semibold"
            : "text-[color:var(--muted)]"
        }`}
      >
        {changed ? "달라짐" : "같음"}
      </span>
    </div>
  );
}
