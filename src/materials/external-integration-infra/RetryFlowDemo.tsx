"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import "./path.css";

/*
  응답 유실이 어떻게 중복 도착이 되는지 시퀀스 다이어그램으로 자동 재생한다.
  요점은 "클라이언트의 timeout과 서버의 처리 완료가 동시에 참"이라는 것 —
  양쪽 상태를 한 화면에서 단계별로 보여준다.

  재생 버튼은 없다. 화면에 들어오면 시작하고 끝나면 잠시 쉬었다 반복한다.
  prefers-reduced-motion에서는 완성된 마지막 장면만 정지 상태로 보여준다.
*/

const LAST = 5;
const REQ_LEN = 450; // 클라이언트 → 서버 화살표 길이
const RES_LEN = 225; // 응답이 유실 지점까지 간 길이

interface Props {
  caption?: string;
}

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function RetryFlowDemo({ caption }: Props) {
  const [rawStep, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const markerId = useId();

  // 감속 선호면 애니메이션 없이 마지막 장면만 — SSR 스냅숏은 false
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // 보이는 동안 단계를 진행하고, 마지막 장면에서 쉬었다가 처음부터 반복
  useEffect(() => {
    if (reduced || !visible) return;
    const delay = rawStep >= LAST ? 2600 : rawStep === 0 ? 700 : 1100;
    const timer = setTimeout(
      () => setStep((s) => (s >= LAST ? 0 : s + 1)),
      delay
    );
    return () => clearTimeout(timer);
  }, [rawStep, visible, reduced]);

  const step = reduced ? LAST : rawStep;
  const received = step >= LAST ? 2 : step >= 2 ? 1 : 0;

  return (
    <figure ref={rootRef} className="m-path my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <svg
          viewBox="0 0 640 300"
          className="block w-full h-auto"
          role="img"
          aria-label="요청 처리 후 응답이 유실되어 재시도가 같은 이벤트를 한 번 더 보내는 과정"
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

          {/* 액터 */}
          <rect
            x="20"
            y="14"
            width="150"
            height="38"
            rx="12"
            fill="var(--t-cell)"
          />
          <text
            x="95"
            y="38"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="var(--fg)"
          >
            클라이언트
          </text>
          <rect
            x="470"
            y="14"
            width="150"
            height="38"
            rx="12"
            fill="var(--t-cell)"
          />
          <text
            x="545"
            y="38"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="var(--fg)"
          >
            서버
          </text>

          {/* 생명선 */}
          <line
            x1="95"
            y1="56"
            x2="95"
            y2="292"
            stroke="var(--border-strong)"
            strokeDasharray="4 5"
          />
          <line
            x1="545"
            y1="56"
            x2="545"
            y2="292"
            stroke="var(--border-strong)"
            strokeDasharray="4 5"
          />

          {/* ① 요청 */}
          <g className="t-pop" opacity={step >= 1 ? 1 : 0}>
            <text
              x="320"
              y="92"
              textAnchor="middle"
              fontSize="12"
              fill="var(--fg)"
            >
              이벤트 A
            </text>
          </g>
          <line
            className="t-draw"
            x1="95"
            y1="104"
            x2="545"
            y2="104"
            stroke="var(--t-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={REQ_LEN}
            strokeDashoffset={step >= 1 ? 0 : REQ_LEN}
            opacity={step >= 1 ? 1 : 0}
            markerEnd={`url(#${markerId})`}
          />

          {/* ② 서버 저장 */}
          <g className="t-pop" opacity={step >= 2 ? 1 : 0}>
            <rect
              x="505"
              y="116"
              width="80"
              height="24"
              rx="12"
              fill="var(--t-ok-soft)"
            />
            <text
              x="545"
              y="132"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--t-ok-text)"
            >
              저장 ✓
            </text>
          </g>

          {/* ③ 응답 유실 */}
          <g className="t-pop" opacity={step >= 3 ? 1 : 0}>
            <text
              x="440"
              y="164"
              textAnchor="middle"
              fontSize="12"
              fill="var(--muted)"
            >
              응답
            </text>
          </g>
          <line
            className="t-draw"
            x1="545"
            y1="176"
            x2="320"
            y2="176"
            stroke="var(--t-warn-text)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RES_LEN}
            strokeDashoffset={step >= 3 ? 0 : RES_LEN}
            opacity={step >= 3 ? 1 : 0}
          />
          <g className="t-pop" opacity={step >= 3 ? 1 : 0}>
            <line
              x1="306"
              y1="170"
              x2="318"
              y2="182"
              stroke="var(--t-warn-text)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="318"
              y1="170"
              x2="306"
              y2="182"
              stroke="var(--t-warn-text)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* ④ 클라이언트 timeout */}
          <g className="t-pop" opacity={step >= 4 ? 1 : 0}>
            <rect
              x="15"
              y="188"
              width="160"
              height="24"
              rx="12"
              fill="var(--t-warn-soft)"
            />
            <text
              x="95"
              y="204"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--t-warn-text)"
            >
              Connection timed out
            </text>
          </g>

          {/* ⑤ 재시도 */}
          <g className="t-pop" opacity={step >= LAST ? 1 : 0}>
            <text
              x="320"
              y="240"
              textAnchor="middle"
              fontSize="12"
              fill="var(--fg)"
            >
              같은 이벤트 A 재전송
            </text>
          </g>
          <line
            className="t-draw"
            x1="95"
            y1="252"
            x2="545"
            y2="252"
            stroke="var(--t-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={REQ_LEN}
            strokeDashoffset={step >= LAST ? 0 : REQ_LEN}
            opacity={step >= LAST ? 1 : 0}
            markerEnd={`url(#${markerId})`}
          />
          <g className="t-pop" opacity={step >= LAST ? 1 : 0}>
            <rect
              x="497"
              y="264"
              width="96"
              height="24"
              rx="12"
              fill="var(--t-warn-soft)"
            />
            <text
              x="545"
              y="280"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--t-warn-text)"
            >
              두 번째 도착
            </text>
          </g>

          <text x="24" y="292" fontSize="12" fill="var(--muted)">
            서버가 받은 이벤트 {received}건
          </text>
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
