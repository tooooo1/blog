import { describe, expect, it } from "vitest";
import { ARRIVALS, PROBES, STAGES, ingest, stageState } from "./logic";

describe("PROBES", () => {
  it("의심 구간은 항상 마지막 통과 지점 바로 다음에서 시작한다", () => {
    for (const probe of PROBES) {
      expect(probe.suspectFrom).toBe(probe.reachedThrough + 1);
      expect(probe.suspectTo).toBeGreaterThanOrEqual(probe.suspectFrom);
      expect(probe.suspectTo).toBeLessThan(STAGES.length);
    }
  });

  it("timeout은 라우팅부터 TCP 연결까지를 의심한다 — 답이 없어서 자리를 못 좁힌다", () => {
    const timeout = PROBES.find((p) => p.key === "timeout")!;
    expect(STAGES[timeout.suspectFrom]).toBe("라우팅");
    expect(STAGES[timeout.suspectTo]).toBe("TCP 연결");
  });

  it("401은 HTTP까지 통과가 확인되고 인증만 의심한다", () => {
    const unauthorized = PROBES.find((p) => p.key === "401")!;
    expect(STAGES[unauthorized.reachedThrough]).toBe("HTTP");
    expect(STAGES[unauthorized.suspectFrom]).toBe("인증");
    expect(unauthorized.suspectFrom).toBe(unauthorized.suspectTo);
  });

  it("resolve 실패는 아무 단계도 통과하지 못한 상태다", () => {
    const resolve = PROBES.find((p) => p.key === "resolve")!;
    expect(resolve.reachedThrough).toBe(-1);
    expect(stageState(resolve, 0)).toBe("suspect");
    expect(stageState(resolve, 1)).toBe("unreached");
  });

  it("stageState는 통과/의심/미도달을 겹치지 않게 가른다", () => {
    const timeout = PROBES.find((p) => p.key === "timeout")!;
    expect(stageState(timeout, 0)).toBe("passed");
    expect(stageState(timeout, 1)).toBe("suspect");
    expect(stageState(timeout, 3)).toBe("suspect");
    expect(stageState(timeout, 4)).toBe("unreached");
  });
});

describe("ingest", () => {
  it("시나리오는 실제 가입 2건, 탈퇴 1건이다", () => {
    const real = ARRIVALS.filter((a) => !a.retry);
    expect(real.filter((a) => a.kind === "가입")).toHaveLength(2);
    expect(real.filter((a) => a.kind === "탈퇴")).toHaveLength(1);
  });

  it("회원 단위 키는 재가입을 중복으로 오판해 가입 1건을 잃는다", () => {
    const { rows, tally } = ingest("member");
    expect(tally).toEqual({ 가입: 1, 탈퇴: 1 });
    const rejoin = rows[3];
    expect(rejoin.arrival.label).toBe("재가입");
    expect(rejoin.stored).toBe(false);
    expect(rejoin.wrongDrop).toBe(true);
  });

  it("이벤트 단위 키는 재시도만 걸러내고 재가입은 집계한다", () => {
    const { rows, tally } = ingest("event");
    expect(tally).toEqual({ 가입: 2, 탈퇴: 1 });
    expect(rows[1].stored).toBe(false);
    expect(rows[1].wrongDrop).toBe(false);
    expect(rows.some((r) => r.wrongDrop)).toBe(false);
  });
});
