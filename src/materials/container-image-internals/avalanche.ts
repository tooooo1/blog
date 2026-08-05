/*
  "내용이 1바이트라도 다르면 다른 digest다"를 눈으로 보이기 위한 기준쌍과 순수 헬퍼.

  digest는 하드코딩하지 않고 브라우저의 Web Crypto가 실시간으로 계산한다 —
  아래 기준쌍만 avalanche.test.ts가 node crypto로 재계산해 대조하고,
  헬퍼는 같은 테스트가 분포까지 확인한다.

  헬퍼가 hex 문자열을 받는 이유: 브라우저(crypto.subtle)와 node(createHash) 양쪽에서
  같은 함수를 쓰려면 공통 표현이 hex뿐이다.
*/

export const BASELINE = "FROM alpine:3.20";
export const VARIANT = "FROM alpine:3.21";

/** 기준쌍의 실제 sha256. crypto.subtle을 못 쓰는 환경(비보안 컨텍스트)의 폴백으로도 쓴다 */
export const REFERENCE = {
  baselineHex: "52da6d451e399d6370dc3e7237c8df86365a1949df0ad2a55296c49310c6a3bc",
  variantHex: "7dc604f50a38ee3ae6357cfdaa071728724ddc10c05d566259dd25bfd625dae1",
  changedHexChars: 61,
  flippedBits: 126,
} as const;

export const HEX_CHARS = 64;
export const TOTAL_BITS = 256;

/** 두 hex digest에서 서로 다른 자리의 인덱스 */
export function changedIndexes(a: string, b: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) out.push(i);
  }
  return out;
}

/** 뒤집힌 비트 수. hex 한 자리는 4비트다 */
export function flippedBits(a: string, b: string): number {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) {
      n += x & 1;
      x >>= 1;
    }
  }
  return n;
}

/** 브라우저에서 sha256. 비보안 컨텍스트에서는 crypto.subtle이 없어 undefined를 준다 */
export async function sha256Hex(text: string): Promise<string | undefined> {
  if (typeof crypto === "undefined" || !crypto.subtle) return undefined;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
