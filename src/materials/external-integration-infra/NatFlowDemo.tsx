"use client";

import { useId, useState } from "react";
import "./path.css";

/*
  내부에서 무엇이 바뀌면 파트너사에도 보이는지를 가른다. 판정은 전부 그림 안에 있다 —
  NAT 상자의 출발지 IP, 허용 목록에서 불이 들어오는 규칙 행, 통과/차단 결과.
  아래 설명 푸터는 두지 않는다.

  주소는 문서용 예제 대역(RFC 5737)과 사설 대역만 쓴다. 사내 값은 들어가지 않는다.
*/

const SERVERS = ["10.20.1.15", "10.20.2.31", "10.20.3.8"];
const SERVERS_SWAPPED = ["10.20.1.87", "10.20.2.14", "10.20.3.52"];
const NAT_IP = "203.0.113.10";
const NAT_IP_CHANGED = "203.0.113.99";

interface Props {
  caption?: string;
}

export function NatFlowDemo({ caption }: Props) {
  const [swapped, setSwapped] = useState(false);
  const [natChanged, setNatChanged] = useState(false);
  const markerId = useId();

  const servers = swapped ? SERVERS_SWAPPED : SERVERS;
  const egress = natChanged ? NAT_IP_CHANGED : NAT_IP;
  const allowed = egress === NAT_IP;

  const toggleClass = (on: boolean) =>
    `cursor-pointer rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
      on
        ? "border-[color:var(--t-line)] bg-[color:var(--t-cell)] text-[color:var(--fg)] font-semibold"
        : "border-[color:var(--border)] text-[color:var(--muted)] hover:bg-[color:var(--hover-bg)]"
    }`;

  return (
    <figure className="m-path my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <div className="flex flex-wrap gap-2 px-5 pt-4">
          <button
            type="button"
            aria-pressed={swapped}
            onClick={() => setSwapped((v) => !v)}
            className={toggleClass(swapped)}
          >
            내부 서버 교체
          </button>
          <button
            type="button"
            aria-pressed={natChanged}
            onClick={() => setNatChanged((v) => !v)}
            className={toggleClass(natChanged)}
          >
            NAT IP 변경
          </button>
        </div>

        <svg
          viewBox="0 0 660 236"
          className="block w-full h-auto"
          role="img"
          aria-label={`내부 서버 세 대가 NAT Gateway를 거쳐 ${egress}로 나가고, 파트너사 허용 목록에서 ${allowed ? "허용" : "차단"}되는 그림`}
        >
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="var(--t-line)" />
            </marker>
          </defs>

          {/* 내부 서버 */}
          {servers.map((ip, i) => (
            <g key={ip}>
              <rect
                x="14"
                y={18 + i * 66}
                width="134"
                height="36"
                rx="10"
                fill="var(--t-cell)"
              />
              <text
                x="81"
                y={41 + i * 66}
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-mono, ui-monospace, monospace)"
                fill="var(--fg)"
              >
                {ip}
              </text>
              <line
                x1="148"
                y1={36 + i * 66}
                x2="242"
                y2="118"
                stroke="var(--t-line)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
              />
            </g>
          ))}

          {/* NAT Gateway */}
          <rect
            x="250"
            y="86"
            width="150"
            height="64"
            rx="12"
            fill="var(--t-cell)"
            stroke="var(--t-line)"
            strokeWidth="1.5"
          />
          <text
            x="325"
            y="110"
            textAnchor="middle"
            fontSize="11"
            fill="var(--muted)"
          >
            NAT Gateway · 출발지
          </text>
          <text
            x="325"
            y="132"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fontFamily="var(--font-mono, ui-monospace, monospace)"
            fill="var(--fg)"
          >
            {egress}
          </text>

          <line
            x1="400"
            y1="118"
            x2="462"
            y2="118"
            stroke="var(--t-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />

          {/* 파트너사 허용 목록 */}
          <rect
            x="470"
            y="52"
            width="176"
            height="132"
            rx="12"
            fill="var(--surface)"
            stroke="var(--border-strong)"
          />
          <text
            x="558"
            y="74"
            textAnchor="middle"
            fontSize="11"
            fill="var(--muted)"
          >
            파트너사 허용 목록
          </text>
          <rect
            x="478"
            y="84"
            width="160"
            height="30"
            rx="8"
            fill={allowed ? "var(--t-ok-soft)" : "transparent"}
          />
          <text
            x="486"
            y="103"
            fontSize="11"
            fontFamily="var(--font-mono, ui-monospace, monospace)"
            fill="var(--fg)"
          >
            203.0.113.10/32
          </text>
          <text
            x="630"
            y="103"
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            fill={allowed ? "var(--t-ok-text)" : "var(--muted)"}
          >
            ALLOW
          </text>
          <rect
            x="478"
            y="120"
            width="160"
            height="30"
            rx="8"
            fill={allowed ? "transparent" : "var(--t-warn-soft)"}
          />
          <text x="486" y="139" fontSize="11" fill="var(--fg)">
            그 외 전부
          </text>
          <text
            x="630"
            y="139"
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            fill={allowed ? "var(--muted)" : "var(--t-warn-text)"}
          >
            DENY
          </text>

          {/* 판정 — 그림 안에서 끝낸다 */}
          <g className="t-pop">
            <rect
              x={allowed ? 508 : 486}
              y="194"
              width={allowed ? 100 : 144}
              height="26"
              rx="13"
              fill={allowed ? "var(--t-ok-soft)" : "var(--t-warn-soft)"}
            />
            <text
              x="558"
              y="211"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={allowed ? "var(--t-ok-text)" : "var(--t-warn-text)"}
            >
              {allowed ? "요청 통과" : "버려짐 → timeout"}
            </text>
          </g>
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[color:var(--muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
