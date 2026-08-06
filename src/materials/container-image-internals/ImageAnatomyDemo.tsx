import { CONFIG, LAYERS, MANIFEST_DIGEST, TAG, shortDigest } from "./digests";
import "./parcel.css";

/*
  상호작용이 없다. 이건 구조를 보이는 해부도이고 구조에는 시간축이 없다 —
  움직임을 붙이면 인과가 아니라 장식이 된다.
  캔버스가 아닌 이유: 라벨과 digest가 전부 텍스트다. 선택복사와 스크린리더를 잃는다.

  막대는 비압축 내용 크기에 비례한다(압축 크기가 아니다). 라벨이 그 값을 글자로도 말한다.
*/

const MAX_BYTES = Math.max(...LAYERS.map((l) => l.rawBytes));
const KB = (bytes: number) => `${Math.round(bytes / 1024)}KB`;

interface Props {
  caption?: string;
}

export function ImageAnatomyDemo({ caption }: Props) {
  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <div className="px-5 py-4 flex flex-col gap-1.5 overflow-x-auto">
          <Node label="tag" value={TAG} note="사람이 옮겨 붙이는 이름표" pill />
          <Branch />
          <Node
            label="manifest"
            value={MANIFEST_DIGEST.push}
            note="아래 전부의 목록"
            digest
          />

          <div className="ml-4 flex flex-col gap-1.5">
            <Branch />
            <Node
              label="config"
              value={CONFIG.digest}
              note="ENV · ENTRYPOINT"
              size={`${CONFIG.size}B`}
              digest
            />
            <div className="pl-3 text-[12px] text-[color:var(--muted)]">layers</div>
            <ul className="list-none p-0 m-0 ml-4 flex flex-col gap-1.5">
              {LAYERS.map((layer) => (
                <li key={layer.name}>
                  <Node
                    label={layer.name.replace(/\s*\(.*\)$/, "")}
                    value={layer.push.digest}
                    note={layer.name.replace(/^[^(]*\(|\)$/g, "")}
                    size={KB(layer.rawBytes)}
                    ratio={layer.rawBytes / MAX_BYTES}
                    digest
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p className="text-[13px] text-[color:var(--muted)] m-0 leading-6">
            화살표는 전부 digest 참조예요. 위에서 아래로 내용이 digest를 결정하고 태그만
            그 바깥에서 손으로 옮겨 붙습니다.
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

function Branch() {
  return (
    <div
      className="pl-3 text-[color:var(--muted)] text-[12px] leading-none"
      aria-hidden="true"
    >
      ↓
    </div>
  );
}

function Node({
  label,
  value,
  note,
  size,
  ratio,
  digest,
  pill,
}: {
  label: string;
  value: string;
  note: string;
  size?: string;
  ratio?: number;
  digest?: boolean;
  pill?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-2 py-1">
      <span className="text-[13px] font-semibold text-[color:var(--fg)] min-w-[64px] shrink-0">
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
      {ratio !== undefined && (
        // 크기는 글자로도 말한다 — 막대는 보조 채널이다
        <span
          className="hidden sm:block h-2 w-24 shrink-0 rounded-sm bg-[color:var(--surface-2)] overflow-hidden"
          aria-hidden="true"
        >
          {/* 채움은 모노크롬 토큰이다 — 주제색 기본 면은 정보를 싣지 않는다는
              parcel.css의 규칙을 지킨다. --border-strong은 트랙 대비 1.19로 곁눈질에
              안 잡혀서 --muted를 쓴다(그래픽 기준 3:1을 크게 넘긴다) */}
          <span
            className="block h-full bg-[color:var(--muted)]"
            style={{ width: `${Math.max(ratio * 100, 3)}%` }}
          />
        </span>
      )}
      {size && (
        <span className="text-[12px] text-[color:var(--muted)] shrink-0 tabular-nums">
          {size}
        </span>
      )}
      <span className="text-[12px] text-[color:var(--muted)]">{note}</span>
    </div>
  );
}
