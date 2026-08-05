import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  BASELINE,
  VARIANT,
  REFERENCE,
  HEX_CHARS,
  TOTAL_BITS,
  changedIndexes,
  flippedBits,
} from "./avalanche";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

describe("기준쌍이 실제 sha256과 일치한다", () => {
  it("baseline·variant digest가 재계산값과 같다", () => {
    expect(sha(BASELINE)).toBe(REFERENCE.baselineHex);
    expect(sha(VARIANT)).toBe(REFERENCE.variantHex);
  });

  it("한 글자만 다르다 — 이게 데모의 전제다", () => {
    expect(BASELINE.length).toBe(VARIANT.length);
    expect(changedIndexes(BASELINE, VARIANT)).toHaveLength(1);
  });

  it("바뀐 hex 자리 수와 뒤집힌 비트 수가 재계산값과 같다", () => {
    expect(changedIndexes(REFERENCE.baselineHex, REFERENCE.variantHex)).toHaveLength(
      REFERENCE.changedHexChars
    );
    expect(flippedBits(REFERENCE.baselineHex, REFERENCE.variantHex)).toBe(
      REFERENCE.flippedBits
    );
  });
});

describe("헬퍼가 맞다", () => {
  it("flippedBits가 hex 한 자리를 4비트로 센다", () => {
    expect(flippedBits("0", "f")).toBe(4);
    expect(flippedBits("0", "1")).toBe(1);
    expect(flippedBits("ff", "ff")).toBe(0);
    expect(flippedBits("00", "ff")).toBe(8);
  });

  it("changedIndexes가 다른 자리의 인덱스를 준다", () => {
    expect(changedIndexes("abcd", "abed")).toEqual([2]);
    expect(changedIndexes("abcd", "abcd")).toEqual([]);
  });
});

describe("avalanche 효과가 밴드 안에 있다", () => {
  /*
    한 글자만 바꾼 200표본. 이상적인 해시라면 뒤집힌 비트가 256의 절반(128) 근처에
    몰린다. 밴드가 넓은 이유: 좁히면 표본 생성 방식만 바꿔도 깨져서 실제 결함이 아닌
    실패를 낸다. 실측(2026-08-05): min 108 · mean 127.8 · max 147.
  */
  const samples: number[] = [];
  const b0 = sha(BASELINE);
  for (let i = 0; i < BASELINE.length && samples.length < 200; i++) {
    for (let d = 1; d <= Math.ceil(200 / BASELINE.length) && samples.length < 200; d++) {
      const c = String.fromCharCode(BASELINE.charCodeAt(i) + d);
      samples.push(flippedBits(b0, sha(BASELINE.slice(0, i) + c + BASELINE.slice(i + 1))));
    }
  }

  it("전 표본이 [90, 166] 안에 있다", () => {
    expect(samples).toHaveLength(200);
    for (const n of samples) {
      expect(n).toBeGreaterThanOrEqual(90);
      expect(n).toBeLessThanOrEqual(166);
    }
  });

  it("평균이 절반(128) 근처다", () => {
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeGreaterThan(120);
    expect(mean).toBeLessThan(136);
  });

  it("digest 길이 상수가 맞다", () => {
    expect(REFERENCE.baselineHex).toHaveLength(HEX_CHARS);
    expect(HEX_CHARS * 4).toBe(TOTAL_BITS);
  });
});
