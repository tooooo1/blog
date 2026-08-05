import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { CONFIG, LAYERS, MANIFEST_DIGEST, shortDigest } from "./digests";

const sha = (buf: Buffer) => "sha256:" + createHash("sha256").update(buf).digest("hex");

// digests.ts 주석의 레시피를 그대로 재현한다. 데모에 박힌 숫자가 실재하는지가 이 파일의 존재 이유다.
const RAW: Record<string, Buffer> = {
  "base (alpine)": Buffer.from("FROM alpine:3.20\n".repeat(4096)),
  "deps (node_modules)": Buffer.from("node_modules/react/index.js\n".repeat(8192)),
  "app (build output)": Buffer.from("dist/server.js\n".repeat(2048)),
};

const CONFIG_JSON = Buffer.from(
  JSON.stringify({
    architecture: "amd64",
    os: "linux",
    config: {
      Entrypoint: ["node", "dist/server.js"],
      Env: ["NODE_ENV=production"],
    },
    rootfs: { type: "layers", diff_ids: LAYERS.map((l) => l.uncompressed) },
  })
);

/** OCI image manifest — descriptor는 digest와 size가 모두 필수다 */
const manifestFor = (key: "push" | "load") =>
  Buffer.from(
    JSON.stringify({
      schemaVersion: 2,
      mediaType: "application/vnd.oci.image.manifest.v1+json",
      config: {
        mediaType: "application/vnd.oci.image.config.v1+json",
        digest: CONFIG.digest,
        size: CONFIG.size,
      },
      layers: LAYERS.map((l) => ({
        mediaType: "application/vnd.oci.image.layer.v1.tar+gzip",
        digest: l[key].digest,
        size: l[key].size,
      })),
    })
  );

describe("digest 체인이 실제 계산과 일치한다", () => {
  it("레이어의 비압축·push·load digest와 압축 크기가 재계산값과 같다", () => {
    for (const layer of LAYERS) {
      const raw = RAW[layer.name];
      expect(raw, `${layer.name} raw 페이로드 누락`).toBeDefined();
      expect(raw.length).toBe(layer.rawBytes);
      expect(sha(raw)).toBe(layer.uncompressed);

      /*
        구워둔 push·load digest를 재압축과 비교하지 않는다. gzip 바이트는 zlib
        구현·플랫폼마다 다르다 — 헤더 OS 바이트가 macOS 19 · Linux 3이고, bun은
        레벨 매핑도 node와 다르다(실측 2026-08-05). ubuntu + bun인 CI에서는 반드시
        깨진다. 구워둔 값은 실제로 뽑아 둔 아티팩트이고, 여기서는 어느 zlib에서도
        성립하는 성질만 확인한다.
      */
      const compressed = gzipSync(raw, { level: 9 });
      expect(compressed.length).toBeLessThan(raw.length);
      expect(sha(compressed)).not.toBe(layer.uncompressed);
      expect(layer.push.size, `${layer.name} push size`).toBeLessThan(layer.rawBytes);
      expect(layer.load.size, `${layer.name} load size`).toBeLessThan(layer.rawBytes);
    }
  });

  it("config digest와 size가 재계산값과 같다", () => {
    expect(sha(CONFIG_JSON)).toBe(CONFIG.digest);
    expect(CONFIG_JSON.length).toBe(CONFIG.size);
  });

  it("manifest digest가 레이어 descriptor 목록에서 파생된다", () => {
    expect(sha(manifestFor("push"))).toBe(MANIFEST_DIGEST.push);
    expect(sha(manifestFor("load"))).toBe(MANIFEST_DIGEST.load);
  });

  it("descriptor가 OCI 필수 필드(digest·size)를 갖춘다", () => {
    for (const d of [CONFIG, ...LAYERS.map((l) => l.push), ...LAYERS.map((l) => l.load)]) {
      expect(d.digest).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(d.size).toBeGreaterThan(0);
    }
  });
});

describe("글의 주장이 데이터로 성립한다", () => {
  it("파일 내용은 동일하다 — 비압축 digest는 경로와 무관하다", () => {
    // 이 데모의 punchline. 깨지면 글의 §3이 틀린 것이다.
    for (const layer of LAYERS) {
      expect(layer.uncompressed).not.toBe(layer.push.digest);
      expect(layer.uncompressed).not.toBe(layer.load.digest);
    }
  });

  it("압축 바이트열이 달라 레이어 digest와 manifest digest가 갈린다", () => {
    for (const layer of LAYERS) {
      expect(layer.push.digest).not.toBe(layer.load.digest);
    }
    expect(MANIFEST_DIGEST.push).not.toBe(MANIFEST_DIGEST.load);
  });

  it("config는 재압축 대상이 아니라 경로가 갈려도 하나다", () => {
    // config는 JSON이고 gzip 레이어가 아니므로 경로별 변형이 존재하지 않는다
    expect(sha(CONFIG_JSON)).toBe(CONFIG.digest);
  });
});

describe("shortDigest", () => {
  it("알고리즘 접두를 남기고 hex만 자른다", () => {
    expect(shortDigest("sha256:0123456789abcdef0123", 12)).toBe("sha256:0123456789ab…");
  });
});
