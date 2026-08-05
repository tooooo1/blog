import { describe, it, expect } from "vitest";
import { gzipSync } from "node:zlib";
import { STREAMS, GZIP_HEADER_BYTES, decode } from "./gzipStreams";

/*
  RAW 레시피를 digests.test.ts에서 의도적으로 복제한다.
  공유 fixture로 빼면 "테스트가 독립적으로 재계산한다"가 무너진다 —
  두 테스트가 같은 실수를 공유하게 된다.
*/
const RAW = Buffer.from("node_modules/react/index.js\n".repeat(8192));

const BASELINE_LEVEL = 9;

function diffAgainstBaseline(a: Uint8Array, b: Uint8Array) {
  const n = Math.min(a.length, b.length);
  let firstDiff = -1;
  let diffCount = 0;
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      if (firstDiff < 0) firstDiff = i;
      diffCount++;
    }
  }
  if (a.length !== b.length) {
    if (firstDiff < 0) firstDiff = n;
    diffCount += Math.abs(a.length - b.length);
  }
  return { firstDiff, diffCount };
}

/*
  재압축 결과를 구워둔 바이트와 비교하지 않는다. gzip 출력은 zlib 구현·플랫폼에 따라
  달라지고, 그게 이 글의 주제다. 실측(2026-08-05):
    - 헤더 OS 바이트(오프셋 9)가 macOS 19 · Linux 3이라 모든 스트림이 최소 1바이트 어긋난다.
    - bun의 zlib은 레벨 매핑이 node와 달라 같은 level 6에서 node 621B · bun 1404B가 나온다.
  CI는 ubuntu + bun이므로 그 비교는 반드시 깨진다(#9에서 실제로 깨졌다).
  그래서 여기서는 구워둔 fixture의 자기 정합과, 어느 zlib에서도 성립하는 성질만 본다.
*/
describe("구워둔 gzip 바이트가 자기 정합적이다", () => {
  it("base64를 디코딩한 길이가 기록된 bytes와 같다", () => {
    for (const s of STREAMS) {
      expect(decode(s.b64).length, `level ${s.level} 길이`).toBe(s.bytes);
    }
  });

  it("압축 레벨을 낮추면 결과가 커진다 — 레벨이 바이트를 바꾼다", () => {
    // 절대값이 아니라 관계만 확인한다. node·bun 어느 쪽에서도 성립한다.
    expect(gzipSync(RAW, { level: 1 }).length).toBeGreaterThan(
      gzipSync(RAW, { level: 9 }).length
    );
  });

  it("firstDiff·diffCount가 재계산값과 같다", () => {
    const base = decode(STREAMS.find((s) => s.level === BASELINE_LEVEL)!.b64);
    for (const s of STREAMS) {
      const { firstDiff, diffCount } = diffAgainstBaseline(base, decode(s.b64));
      expect(firstDiff, `level ${s.level} firstDiff`).toBe(s.firstDiff);
      expect(diffCount, `level ${s.level} diffCount`).toBe(s.diffCount);
    }
  });
});

describe("데모가 말하는 주장이 데이터로 성립한다", () => {
  it("level 6은 길이가 같고 헤더 안에서 딱 1바이트만 다르다", () => {
    const s = STREAMS.find((x) => x.level === 6)!;
    const base = STREAMS.find((x) => x.level === BASELINE_LEVEL)!;
    // digests.ts의 size 621/621이 왜 같은지를 설명하는 사실
    expect(s.bytes).toBe(base.bytes);
    expect(s.diffCount).toBe(1);
    expect(s.firstDiff).toBeLessThan(GZIP_HEADER_BYTES);
  });

  it("그 1바이트는 XFL(오프셋 8)이고 deflate·CRC는 완전히 동일하다", () => {
    const base = decode(STREAMS.find((x) => x.level === BASELINE_LEVEL)!.b64);
    const six = decode(STREAMS.find((x) => x.level === 6)!.b64);
    expect(six[8]).not.toBe(base[8]);
    for (let i = 0; i < base.length; i++) {
      if (i === 8) continue;
      expect(six[i], `오프셋 ${i}`).toBe(base[i]);
    }
  });

  it("level 1은 길이가 달라지고 헤더 밖까지 상이하다", () => {
    const s = STREAMS.find((x) => x.level === 1)!;
    expect(s.bytes).toBeGreaterThan(STREAMS.find((x) => x.level === 9)!.bytes);
    expect(s.diffCount).toBeGreaterThan(GZIP_HEADER_BYTES);
  });

  it("MTIME(바이트 4~7)이 0이라 압축이 결정적이다", () => {
    for (const s of STREAMS) {
      const b = decode(s.b64);
      expect([b[4], b[5], b[6], b[7]], `level ${s.level} MTIME`).toEqual([0, 0, 0, 0]);
    }
  });
});
