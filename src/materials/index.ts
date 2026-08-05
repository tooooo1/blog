/*
  글 slug → 그 글 전용 시각자료 로더.

  템플릿 리터럴 동적 import(`@/materials/${slug}/index`) 대신 명시 등록을 쓴다.
  이유는 코드 스플리팅이 아니라 오류 처리다 — 템플릿 리터럴 방식은 "자료 없음"을
  판별하려고 try/catch가 필요하고, 그 catch가 데모 모듈의 초기화 오류까지 삼켜
  MDX가 "정의되지 않은 컴포넌트"로 엉뚱하게 실패한다. 여기서는 등록 여부로 판별하므로
  catch가 아예 없다. 대가는 새 자료 폴더마다 이 파일에 한 줄.

  ponytail: 데모는 /blog/[slug] 라우트의 공용 클라이언트 청크에 들어가므로 자료가 없는
  글도 함께 받는다(실측 2026-08-05: 글 3편 전부가 같은 청크 참조. 등록 방식을 바꿔도
  동일 — 단일 동적 라우트의 성질이다). 자료가 수십 개로 늘어 공용 청크가 커지면
  데모를 next/dynamic(ssr:false) 래퍼로 감싸 클라이언트에서만 지연 로드하는 쪽으로 올린다.
*/
export const MATERIALS: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  "container-image-internals": () => import("./container-image-internals"),
};

export async function getMaterials(
  slug: string
): Promise<Record<string, unknown>> {
  const load = MATERIALS[slug];
  return load ? { ...(await load()) } : {};
}
