/*
  digest 값은 전부 실제로 계산한 것이다 — 손으로 적은 가짜가 아니다.
  digests.test.ts가 아래 레시피를 그대로 재계산해 이 파일의 값과 대조한다.

    레이어 페이로드 → gzip(level 9) = --push 경로
                    → gzip(level 6) = --load 경로 (재압축된 쪽)
    두 레벨은 "압축하는 쪽이 다르면 바이트가 갈린다"를 보이기 위한 대역이다.
    BuildKit·데몬의 실제 gzip 설정이 이 값이라고 주장하지 않는다.
    manifest JSON은 "압축된" 레이어의 digest+size를 나열하므로,
    레이어 바이트가 갈리면 manifest 내용도 갈리고 따라서 manifest digest도 갈린다.

  한계 — 이 데모가 주장하지 않는 것:
    페이로드는 실제 tar 아카이브가 아니라 **결정적 대역물**이다. 따라서 이 digest들은
    실제 레지스트리에서 나오는 값이 아니다. 데모가 보이는 것은 "재압축이 digest를
    바꾼다"는 메커니즘이고, 그 메커니즘은 여기서 진짜로 작동한다.
    descriptor는 OCI 규격대로 digest와 size를 모두 갖는다.
    실제 파이프라인 로그의 digest는 내부 식별자라 쓰지 않았다.
*/

export interface Blob {
  digest: string;
  /** OCI descriptor 필수 필드 — 압축된 blob의 바이트 수 */
  size: number;
}

export interface Layer {
  name: string;
  /** 비압축 페이로드 크기. 테스트가 레시피 재현을 확인하는 데 쓴다 */
  rawBytes: number;
  /** 비압축 내용의 digest — 두 경로에서 동일하다 (= 파일 내용이 같다는 증거) */
  uncompressed: string;
  push: Blob;
  load: Blob;
}

export const CONFIG: Blob = {
  digest: "sha256:189a3d6f110c9b6d17a6e69f302a8f3a137617cb865786682e595bc8522aed2e",
  size: 379,
};

export const LAYERS: Layer[] = [
  {
    name: "base (alpine)",
    rawBytes: 69632,
    uncompressed: "sha256:c62809b5a2eb42cd683f35d74e98a4bed04a2264933fbf20ccbe303397d5ac92",
    push: { digest: "sha256:0ef99b057473e28dd33d8bff0b36a46db6b6f9290ce2c38dc0c491d69c6a4ad9", size: 232 },
    load: { digest: "sha256:e1d33040a61cf3f804ac3070169f9fb71f5d2772b8a48bdecd6334d0e1d6c8f8", size: 232 },
  },
  {
    name: "deps (node_modules)",
    rawBytes: 229376,
    uncompressed: "sha256:8d8ecf49748f89c296c42af5dcf9a1c193ca484fe1ccb3852b989090dd2dfbd5",
    push: { digest: "sha256:4d5c0e2a885e6c28acf90ebc60b27365d9194bb0dcc0ab30e09b4ad423f7644d", size: 621 },
    load: { digest: "sha256:13631416a1e58c98d9d1cf0f785007a95f1b1d2f3d931f7c34f3eff967783ec0", size: 621 },
  },
  {
    name: "app (build output)",
    rawBytes: 30720,
    uncompressed: "sha256:3ceb43832add77f6792b34b17b0156e752746a81fc582c4a07854b91efeef581",
    push: { digest: "sha256:97e2fc9921f9ad3adb43663b7eca76d24723edfeba10a91ca28bd48cbde4bfb9", size: 110 },
    load: { digest: "sha256:015a162c88d486ebf4fc62d20436bf6946884c9f895b9da0de24a383e0687cb5", size: 110 },
  },
];

export const MANIFEST_DIGEST = {
  push: "sha256:4e285a83e8be92f3abf7d776900b07ea3e0d1bfe9ed9b9d981b841c6371884e4",
  load: "sha256:44107a568449de5a19583f457a34ba8a2103654ec6c29f6004af196e68e13f44",
} as const;

/** manifest JSON의 바이트 수. index descriptor가 digest와 size를 둘 다 요구한다 */
export const MANIFEST_SIZE = { push: 709 } as const;

export const TAG = "git-a1b2c3d";

/** 데모 표시용 — sha256:0ef99b057473… 형태로 자른다 */
export function shortDigest(digest: string, hexChars = 12): string {
  const [algo, hex] = digest.split(":");
  return `${algo}:${hex.slice(0, hexChars)}…`;
}
