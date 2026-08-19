/*
  두 데모의 판정 로직. 렌더링과 분리해 둔 이유는 이 판정이 글의 주장 그 자체라서다 —
  "에러 문구는 요청이 어디까지 갔는지를 말해 준다", "키의 단위가 집계를 가른다".
  logic.test.ts가 이 판정을 지킨다.
*/

export const STAGES = [
  "DNS",
  "라우팅",
  "NAT·방화벽",
  "TCP 연결",
  "TLS 핸드셰이크",
  "HTTP",
  "인증",
  "애플리케이션",
] as const;

export interface Probe {
  key: string;
  /** curl이 실제로 보여 주는 문구 */
  label: string;
  /** 이 단계까지는 통과가 "확인"된 것 (index, 없으면 -1) */
  reachedThrough: number;
  /** 의심 구간 [from, to] — 항상 reachedThrough 바로 다음에서 시작한다 */
  suspectFrom: number;
  suspectTo: number;
  note: string;
}

export const PROBES: Probe[] = [
  {
    key: "resolve",
    label: "Could not resolve host",
    reachedThrough: -1,
    suspectFrom: 0,
    suspectTo: 0,
    note: "이름이 주소로 바뀌지 않았습니다. 요청은 아직 아무 데도 가지 않았어요.",
  },
  {
    key: "timeout",
    label: "Connection timed out",
    reachedThrough: 0,
    suspectFrom: 1,
    suspectTo: 3,
    note: "주소는 얻었는데 답이 없습니다. 조용히 버리는 게 방화벽의 기본 동작이라, 경로·출발지 IP·허용 목록처럼 답 없이 막는 자리를 먼저 봅니다.",
  },
  {
    key: "ssl",
    label: "SSL certificate problem",
    reachedThrough: 3,
    suspectFrom: 4,
    suspectTo: 4,
    note: "TCP 연결은 만들어졌습니다. 인증서를 주고받다 멈춘 것이라 경로가 아니라 TLS 쪽을 봅니다.",
  },
  {
    key: "401",
    label: "401 Unauthorized",
    reachedThrough: 5,
    suspectFrom: 6,
    suspectTo: 6,
    note: "HTTP 응답이 돌아왔으니 경로는 전부 통과했습니다. 자격증명, 서명, 토큰을 봅니다.",
  },
];

export type StageState = "passed" | "suspect" | "unreached";

export function stageState(probe: Probe, index: number): StageState {
  if (index <= probe.reachedThrough) return "passed";
  if (index >= probe.suspectFrom && index <= probe.suspectTo) return "suspect";
  return "unreached";
}

/* ---- 멱등키 시뮬레이션 ---- */

export type Strategy = "member" | "event";

export interface Arrival {
  label: string;
  kind: "가입" | "탈퇴";
  /** 이벤트 발생 시점마다 다른 값. 재시도는 같은 이벤트이므로 같은 seed */
  eventSeed: number;
  retry: boolean;
}

/** 같은 회원의 가입 → (응답 유실로) 재시도 → 탈퇴 → 재가입 */
export const ARRIVALS: Arrival[] = [
  { label: "가입", kind: "가입", eventSeed: 1, retry: false },
  {
    label: "가입 재시도 (timeout 후)",
    kind: "가입",
    eventSeed: 1,
    retry: true,
  },
  { label: "탈퇴", kind: "탈퇴", eventSeed: 2, retry: false },
  { label: "재가입", kind: "가입", eventSeed: 3, retry: false },
];

export function keyOf(strategy: Strategy, arrival: Arrival): string {
  return strategy === "member"
    ? `hash(u1 + ${arrival.kind})`
    : `evt-${arrival.eventSeed}`;
}

export interface IngestRow {
  arrival: Arrival;
  key: string;
  stored: boolean;
  /** 재시도가 아닌 새 이벤트인데 키가 겹쳐서 버려진 경우 — 집계가 실제와 어긋난다 */
  wrongDrop: boolean;
}

export function ingest(strategy: Strategy): {
  rows: IngestRow[];
  tally: { 가입: number; 탈퇴: number };
} {
  const seen = new Set<string>();
  const tally = { 가입: 0, 탈퇴: 0 };
  const rows = ARRIVALS.map((arrival) => {
    const key = keyOf(strategy, arrival);
    const stored = !seen.has(key);
    if (stored) {
      seen.add(key);
      tally[arrival.kind] += 1;
    }
    return { arrival, key, stored, wrongDrop: !stored && !arrival.retry };
  });
  return { rows, tally };
}
