import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { MANIFEST_DIGEST, MANIFEST_SIZE } from "./digests";
import {
  EMPTY_CONFIG,
  PROVENANCE_LAYER,
  ATTESTATION_MANIFEST,
  IMAGE_MANIFEST,
  INDEX,
} from "./ociIndex";

const sha = (b: Buffer) => "sha256:" + createHash("sha256").update(b).digest("hex");
const J = (o: unknown) => Buffer.from(JSON.stringify(o));

/*
  이 파일의 객체 리터럴 순서가 바이트 SSOT다 — JSON.stringify의 키 순서가 곧 삽입 순서이므로.
  필드를 넣거나 순서를 바꾸면 digest가 바뀌고 아래 대조가 즉시 깨진다.
*/
const emptyConfig = Buffer.from("{}");

const provenance = J({
  _type: "https://in-toto.io/Statement/v0.1",
  // subject는 in-toto Statement의 필수 필드다 — 이 증명서가 어느 이미지에 대한 것인지 결합한다
  subject: [{ name: "wello", digest: { sha256: MANIFEST_DIGEST.push.slice(7) } }],
  predicateType: "https://slsa.dev/provenance/v0.2",
  predicate: {
    buildType: "https://mobyproject.org/buildkit@v1",
    invocation: { configSource: {} },
  },
});

const attestationManifest = J({
  schemaVersion: 2,
  mediaType: "application/vnd.oci.image.manifest.v1+json",
  config: {
    mediaType: "application/vnd.oci.image.config.v1+json",
    digest: sha(emptyConfig),
    size: emptyConfig.length,
  },
  layers: [
    {
      mediaType: "application/vnd.in-toto+json",
      digest: sha(provenance),
      size: provenance.length,
      annotations: {
        "in-toto.io/predicate-type": "https://slsa.dev/provenance/v0.2",
      },
    },
  ],
});

const imageDescriptor = {
  mediaType: "application/vnd.oci.image.manifest.v1+json",
  digest: MANIFEST_DIGEST.push,
  size: MANIFEST_SIZE.push,
  platform: { architecture: "amd64", os: "linux" },
};

const attestationDescriptor = {
  mediaType: "application/vnd.oci.image.manifest.v1+json",
  digest: sha(attestationManifest),
  size: attestationManifest.length,
  platform: { architecture: "unknown", os: "unknown" },
  annotations: {
    "vnd.docker.reference.digest": MANIFEST_DIGEST.push,
    "vnd.docker.reference.type": "attestation-manifest",
  },
};

const index = (manifests: unknown[]) =>
  J({
    schemaVersion: 2,
    mediaType: "application/vnd.oci.image.index.v1+json",
    manifests,
  });

const withProvenance = index([imageDescriptor, attestationDescriptor]);
const withoutProvenance = index([imageDescriptor]);

describe("index 체인이 실제 계산과 일치한다", () => {
  it("빈 config·provenance 레이어·attestation manifest", () => {
    expect(sha(emptyConfig)).toBe(EMPTY_CONFIG.digest);
    expect(emptyConfig.length).toBe(EMPTY_CONFIG.size);
    expect(sha(provenance)).toBe(PROVENANCE_LAYER.digest);
    expect(provenance.length).toBe(PROVENANCE_LAYER.size);
    expect(sha(attestationManifest)).toBe(ATTESTATION_MANIFEST.digest);
    expect(attestationManifest.length).toBe(ATTESTATION_MANIFEST.size);
  });

  it("index digest·size가 provenance 유무에 따라 재계산값과 같다", () => {
    expect(sha(withProvenance)).toBe(INDEX.withProvenance.digest);
    expect(withProvenance.length).toBe(INDEX.withProvenance.size);
    expect(sha(withoutProvenance)).toBe(INDEX.withoutProvenance.digest);
    expect(withoutProvenance.length).toBe(INDEX.withoutProvenance.size);
  });
});

describe("글의 §4 주장이 데이터로 성립한다", () => {
  it("(a) amd64 manifest digest는 provenance와 무관하게 불변이다", () => {
    expect(IMAGE_MANIFEST.digest).toBe(MANIFEST_DIGEST.push);
    expect(imageDescriptor.digest).toBe(MANIFEST_DIGEST.push);
  });

  it("(b) 태그가 가리키는 digest가 manifest에서 index로 바뀐다", () => {
    expect(INDEX.withProvenance.digest).not.toBe(MANIFEST_DIGEST.push);
    expect(INDEX.withoutProvenance.digest).not.toBe(MANIFEST_DIGEST.push);
  });

  it("(c) unknown/unknown descriptor 하나로 태그 대상이 또 바뀐다", () => {
    expect(INDEX.withProvenance.digest).not.toBe(INDEX.withoutProvenance.digest);
    // 이게 "에러 없이 산출물 모양만 조용히 바뀐다"의 실체다
    expect(INDEX.withProvenance.size).toBeGreaterThan(INDEX.withoutProvenance.size);
  });
});
