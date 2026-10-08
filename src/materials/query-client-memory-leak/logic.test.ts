import { describe, expect, it } from "vitest";
import {
  CLONE_CHUNKS,
  CLONE_LAST,
  GC_BLOCK,
  GC_LAST,
  GC_PROBES,
  MEMORY_SLOTS,
  MODULE_LAST,
  REPRO_BARS,
  SAWTOOTH_CYCLES,
  TICKS_AFTER,
  TICKS_BEFORE,
  barLength,
  cloneState,
  gcState,
  makeSawtooth,
  memoryState,
  moduleState,
  textWidth,
} from "./logic";

describe("textWidth", () => {
  it("한글은 글자 크기만큼, 영문은 더 좁게 센다", () => {
    expect(textWidth("가나", 10)).toBe(20);
    expect(textWidth("ab", 10)).toBeCloseTo(11.6);
    expect(textWidth("a b", 10)).toBeCloseTo(14.6);
  });
});

describe("cloneState", () => {
  it("스트림이 갈라진 직후에는 어느 장면이든 원본 버퍼가 가득 차 있다", () => {
    for (const step of [0, 2, 4]) {
      const s = cloneState(step);
      expect(s.phase).toBe(0);
      expect(s.held).toBe(CLONE_CHUNKS);
      expect(s.outcome).toBe("pending");
    }
  });

  it("성공 응답은 원본도 읽어서 버퍼가 빈다", () => {
    expect(cloneState(1)).toMatchObject({
      scene: 0,
      held: 0,
      outcome: "drained",
    });
  });

  it("에러 응답은 cancel하지 않으면 버퍼가 그대로 남는다", () => {
    expect(cloneState(3)).toMatchObject({
      scene: 1,
      held: CLONE_CHUNKS,
      outcome: "held",
    });
  });

  it("cancel하면 버퍼가 즉시 빈다", () => {
    expect(cloneState(CLONE_LAST)).toMatchObject({
      scene: 2,
      held: 0,
      outcome: "cancelled",
    });
  });

  it("범위를 벗어난 단계는 끝 장면으로 고정한다", () => {
    expect(cloneState(99)).toEqual(cloneState(CLONE_LAST));
    expect(cloneState(-1)).toEqual(cloneState(0));
  });
});

describe("REPRO_BARS", () => {
  it("글에 적은 실측값과 같다", () => {
    expect(REPRO_BARS.map((b) => [b.key, b.mib])).toEqual([
      ["unread", 93],
      ["noclone", 7],
      ["cancel", 2],
    ]);
  });

  it("막대 길이는 값에 비례하고 가장 큰 값이 전체 길이다", () => {
    expect(barLength(93, 480)).toBe(480);
    expect(barLength(7, 480)).toBeCloseTo((7 / 93) * 480);
    expect(barLength(2, 480)).toBeLessThan(barLength(7, 480));
  });
});

describe("memoryState", () => {
  it("버퍼는 쌓였다가 cancel로 비고, 누수 장면만 빨강이다", () => {
    expect(memoryState(0).buffers).toBe(0);
    expect(memoryState(1).buffers).toBeLessThan(MEMORY_SLOTS);
    expect(memoryState(2)).toEqual({ buffers: MEMORY_SLOTS, tone: "warn" });
    expect(memoryState(3)).toEqual({ buffers: 0, tone: "ok" });
  });
});

describe("gc", () => {
  it("멈춘 구간 안의 probe만 응답이 없다", () => {
    for (const p of GC_PROBES) {
      const inside = p.x > GC_BLOCK.from && p.x < GC_BLOCK.to;
      expect(p.frozen).toBe(inside);
    }
  });

  it("요청 눈금은 멈춘 구간을 피한다", () => {
    for (const x of TICKS_BEFORE) expect(x).toBeLessThan(GC_BLOCK.from);
    for (const x of TICKS_AFTER) expect(x).toBeGreaterThan(GC_BLOCK.to);
  });

  it("단계가 진행되면 보이는 것이 줄지 않는다", () => {
    const keys = ["block", "frozenProbes", "restarted", "readings"] as const;
    for (let s = 1; s <= GC_LAST; s++) {
      for (const k of keys) {
        if (gcState(s - 1)[k]) expect(gcState(s)[k]).toBe(true);
      }
    }
    expect(gcState(GC_LAST).readings).toBe(true);
    expect(gcState(0).block).toBe(false);
  });
});

describe("makeSawtooth", () => {
  it("같은 입력은 항상 같은 값이다", () => {
    expect(makeSawtooth("leak")).toEqual(makeSawtooth("leak"));
  });

  it("정상은 바닥이 모두 같다", () => {
    const { troughs } = makeSawtooth("normal");
    expect(troughs).toHaveLength(SAWTOOTH_CYCLES);
    expect(new Set(troughs.map((t) => t.v)).size).toBe(1);
  });

  it("누수는 바닥이 매번 오른다", () => {
    const { troughs } = makeSawtooth("leak");
    for (let i = 1; i < troughs.length; i++) {
      expect(troughs[i]!.v).toBeGreaterThan(troughs[i - 1]!.v);
    }
  });

  it("값은 0..1 안이고 x는 줄지 않는다", () => {
    for (const kind of ["normal", "leak"] as const) {
      const { points } = makeSawtooth(kind);
      points.forEach((p, i) => {
        expect(p.v).toBeGreaterThan(0);
        expect(p.v).toBeLessThan(1);
        if (i > 0) expect(p.x).toBeGreaterThanOrEqual(points[i - 1]!.x);
      });
      expect(points[points.length - 1]!.x).toBeCloseTo(1);
    }
  });
});

describe("moduleState", () => {
  it("공유 캐시에는 먼저 온 요청의 항목이 쌓인다", () => {
    expect(moduleState(0)).toMatchObject({ entryA: false, entryB: false });
    expect(moduleState(1)).toMatchObject({ entryA: true, entryB: false });
    expect(moduleState(2)).toMatchObject({ entryA: true, entryB: true });
  });

  it("비로그인이 오는 장면에서만 남의 데이터가 읽힌다", () => {
    expect(moduleState(3)).toMatchObject({ reqAnon: true, leak: true });
    for (let s = 0; s <= MODULE_LAST; s++) {
      if (s !== 3) expect(moduleState(s).leak).toBe(false);
    }
  });

  it("수정 후에는 공유 상자가 없고 요청 끝에 상자도 사라진다", () => {
    expect(moduleState(4)).toMatchObject({
      shared: false,
      perRequest: true,
      gone: false,
    });
    expect(moduleState(5)).toMatchObject({
      shared: false,
      perRequest: true,
      gone: true,
    });
  });
});
