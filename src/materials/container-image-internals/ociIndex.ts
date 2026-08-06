import { MANIFEST_DIGEST, MANIFEST_SIZE, type Blob } from "./digests";

/*
  provenance attestation을 붙이면 태그가 manifest 대신 index(목차)를 가리키게 된다.
  아래 digest는 전부 실제로 계산한 값이고 ociIndex.test.ts가 같은 레시피를 재조립해 대조한다.

  레시피의 바이트 SSOT는 JSON.stringify의 키 순서, 즉 테스트 안의 객체 리터럴 순서다.
  필드를 하나 넣거나 순서를 바꾸면 digest가 바뀌고 테스트가 즉시 잡는다.

  이 데모가 보이려는 것은 글의 주장 하나다: 전환은 에러 없이 통과하는데
  "태그가 가리키는 대상"만 조용히 바뀐다. amd64 manifest 자체는 그대로다.
*/

export const EMPTY_CONFIG: Blob = {
  digest: "sha256:44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
  size: 2,
};

/** in-toto Statement (SLSA provenance v0.2) — subject가 amd64 manifest에 결합된다 */
export const PROVENANCE_LAYER: Blob = {
  digest: "sha256:8171ace550ca9a322b89a8e98f6cb5f44f0dbdc9e70f7c219e85cc7327dbe194",
  size: 309,
};

/** unknown/unknown 플랫폼으로 위장해 index에 실리는 가짜 manifest */
export const ATTESTATION_MANIFEST: Blob = {
  digest: "sha256:b6bad6265921b57ad5759756017ec529d112881479d049c75a3560c440e9920a",
  size: 463,
};

export const IMAGE_MANIFEST: Blob = {
  digest: MANIFEST_DIGEST.push,
  size: MANIFEST_SIZE.push,
};

export const INDEX = {
  withProvenance: {
    digest: "sha256:e77bf33e29d7558089380f32630c6547983dd2bdbaa1412944a524b8cd2b2534",
    size: 666,
  },
  withoutProvenance: {
    digest: "sha256:cc847db4fac45cb7e6bebd19ee2f3565a92bed0bf4b48be531902c2734a2f634",
    size: 289,
  },
} as const satisfies Record<string, Blob>;

export interface Consumer {
  name: string;
  /** index를 이해하는가 */
  handlesIndex: boolean;
  note: string;
}

export const CONSUMERS: Consumer[] = [
  {
    name: "k8s (containerd)",
    handlesIndex: true,
    note: "목차에서 자기 플랫폼을 골라 pull하니까 배포는 안 깨져요",
  },
  {
    name: "레지스트리 콘솔",
    handlesIndex: true,
    note: "unknown/unknown이 목록에 뜹니다",
  },
  {
    name: "docker manifest inspect를 파싱하는 스크립트",
    handlesIndex: false,
    note: "출력이 하나라는 가정이 깨집니다",
  },
  {
    name: "digest 대조 도구·스캐너",
    handlesIndex: false,
    note: "가리키는 digest가 바뀝니다",
  },
];
