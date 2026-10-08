/*
  데모 6개의 장면 → 상태 판정. 렌더링과 분리해 둔 이유는 이 판정이 글의 주장 그 자체라서다 —
  "에러 경로에서 읽는 쪽이 없으면 버퍼가 남는다", "major GC 뒤 바닥이 오르면 참조가 남은 것",
  "서버의 모듈 스코프는 프로세스 하나를 모두가 쓴다". logic.test.ts가 이 판정을 지킨다.
*/

/** 라벨 폭 추정. 한글은 글자 크기만큼, 영문·숫자는 0.58배, 공백은 0.3배 */
export function textWidth(text: string, fs: number): number {
  let w = 0;
  for (const ch of text) {
    if (ch === " ") w += fs * 0.3;
    else if (ch.charCodeAt(0) > 0x2e7f) w += fs;
    else w += fs * 0.58;
  }
  return w;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/* ---- 1. clone 갈래 ---- */

export const CLONE_LAST = 5;
export const CLONE_CHUNKS = 4;

export type CloneOutcome = "pending" | "drained" | "held" | "cancelled";

/** 장면 3개를 각각 2단계(스트림이 갈라짐 → 결과)로 나눈 6단계 */
export function cloneState(step: number): {
  scene: 0 | 1 | 2;
  phase: 0 | 1;
  /** 원본 쪽 버퍼에 남은 청크 수 */
  held: number;
  outcome: CloneOutcome;
} {
  const s = clamp(step, 0, CLONE_LAST);
  const scene = Math.floor(s / 2) as 0 | 1 | 2;
  const phase = (s % 2) as 0 | 1;
  if (phase === 0)
    return { scene, phase, held: CLONE_CHUNKS, outcome: "pending" };
  if (scene === 0) return { scene, phase, held: 0, outcome: "drained" };
  if (scene === 1) return { scene, phase, held: CLONE_CHUNKS, outcome: "held" };
  return { scene, phase, held: 0, outcome: "cancelled" };
}

/* ---- 2. 재현 막대 ---- */

export const REPRO_BARS = [
  { key: "unread", label: "clone + 원본 안 읽음", mib: 93, tone: "warn" },
  { key: "noclone", label: "clone 없음", mib: 7, tone: "cell" },
  { key: "cancel", label: "clone + cancel()", mib: 2, tone: "ok" },
] as const;

/** 강제 GC 뒤 세 경우 모두 같은 heapUsed */
export const REPRO_HEAP_MIB = 7.5;

export function barLength(mib: number, full: number): number {
  const max = Math.max(...REPRO_BARS.map((b) => b.mib));
  return (mib / max) * full;
}

/* ---- 3. process.memoryUsage ---- */

export const MEMORY_LAST = 3;
export const MEMORY_SLOTS = 8;

/** 0 버퍼 도착 · 1 쌓이는 중 · 2 쌓인 채 남음(누수) · 3 cancel로 비움 */
export function memoryState(step: number): {
  buffers: number;
  tone: "cell" | "warn" | "ok";
} {
  const s = clamp(step, 0, MEMORY_LAST);
  return {
    buffers: [0, 3, MEMORY_SLOTS, 0][s] ?? 0,
    tone: (["cell", "cell", "warn", "ok"] as const)[s] ?? "cell",
  };
}

/* ---- 4. 강제 GC와 liveness probe ---- */

export const GC_LAST = 4;
export const GC_BLOCK = { from: 235, to: 440 } as const;
export const GC_RESTART_X = 452;

export const GC_PROBES = [
  { x: 50, frozen: false },
  { x: 120, frozen: false },
  { x: 190, frozen: false },
  { x: 270, frozen: true },
  { x: 340, frozen: true },
  { x: 410, frozen: true },
] as const;

const ticks = (from: number, to: number, gap: number) => {
  const out: number[] = [];
  for (let x = from; x <= to; x += gap) out.push(x);
  return out;
};
/** 멈추기 전·새 프로세스의 요청 눈금 */
export const TICKS_BEFORE = ticks(36, 224, 14);
export const TICKS_AFTER = ticks(476, 612, 14);

export function gcState(step: number): {
  block: boolean;
  frozenProbes: boolean;
  restarted: boolean;
  readings: boolean;
} {
  const s = clamp(step, 0, GC_LAST);
  return {
    block: s >= 1,
    frozenProbes: s >= 2,
    restarted: s >= 3,
    readings: s >= 4,
  };
}

/* ---- 5. old space 톱니 ---- */

export const SAWTOOTH_CYCLES = 6;

export interface Sawtooth {
  /** 선을 이루는 점. x는 0..1, v는 0..1 */
  points: { x: number; v: number }[];
  /** major GC 직후 바닥. 첫 값은 시작점 */
  troughs: { x: number; v: number }[];
}

/**
 * 결정적 톱니. Math.random을 쓰지 않아 서버와 클라이언트가 같은 값을 만든다.
 * normal은 바닥이 평평하고, leak은 바닥이 cycle마다 오른다.
 */
export function makeSawtooth(kind: "normal" | "leak"): Sawtooth {
  const floorAt = (i: number) =>
    kind === "normal" ? 0.22 : 0.12 + (0.5 * i) / (SAWTOOTH_CYCLES - 1);
  const amp = kind === "normal" ? 0.5 : 0.3;
  const points: Sawtooth["points"] = [];
  const troughs: Sawtooth["troughs"] = [];
  for (let i = 0; i < SAWTOOTH_CYCLES; i++) {
    const x0 = i / SAWTOOTH_CYCLES;
    const x1 = (i + 1) / SAWTOOTH_CYCLES;
    const floor = floorAt(i);
    // 꼭대기만 조금씩 다르게 — 규칙적인 패턴이라 hydration에 안전하다
    const peak = floor + amp + ((i * 7) % 4) * 0.02;
    if (i === 0) points.push({ x: x0, v: floor });
    troughs.push({ x: x0, v: floor });
    points.push({ x: x1, v: peak });
    if (i < SAWTOOTH_CYCLES - 1) points.push({ x: x1, v: floorAt(i + 1) });
  }
  return { points, troughs };
}

/* ---- 6. 모듈 스코프 QueryClient ---- */

export const MODULE_LAST = 5;

/** 0 빈 서버 · 1 A · 2 B · 3 비로그인이 A를 읽음 · 4 수정 후(요청마다 새 것) · 5 요청이 끝나 사라짐 */
export function moduleState(step: number): {
  reqA: boolean;
  reqB: boolean;
  reqAnon: boolean;
  /** 공유 캐시 상자 */
  shared: boolean;
  entryA: boolean;
  entryB: boolean;
  /** 비로그인이 남의 항목을 읽는 장면 */
  leak: boolean;
  /** 요청마다 새 QueryClient */
  perRequest: boolean;
  /** 요청이 끝나 상자가 사라진 뒤 */
  gone: boolean;
} {
  const s = clamp(step, 0, MODULE_LAST);
  const fixed = s >= 4;
  return {
    reqA: s >= 1,
    reqB: s >= 2,
    reqAnon: s >= 3,
    shared: !fixed,
    entryA: s >= 1,
    entryB: s >= 2,
    leak: s === 3,
    perRequest: fixed,
    gone: s >= 5,
  };
}
