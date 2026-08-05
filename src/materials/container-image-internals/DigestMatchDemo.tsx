"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCanvasTokens, setupCanvas, useContainerWidth } from "../canvas";
import { MANIFEST_DIGEST, shortDigest } from "./digests";
import "./parcel.css";

/*
  글을 연 미스터리(sha256이 두 개)를 닫는 해소 데모.
  --load: 빌드의 digest와 레지스트리의 digest 칩 두 개가 어긋나 있다.
  --push: 두 칩이 하나로 수렴하고 확인 링이 퍼진다 — 이전엔 2개, 이후엔 1개.

  수렴은 유한 tween 1회(토글당)라 영구 루프가 없다 → 화면 밖 정지 훅 불필요.
  digest 값은 기존 MANIFEST_DIGEST 재사용 — 새 숫자 0, 새 테스트 불필요.
  캔버스 안 텍스트는 보조 채널이고, 선택복사 가능한 값은 아래 DOM footer가 담당한다.
*/

const MAX_W = 552;
const H = 168;
const CHIP_H = 40;
const APART = 34; // 어긋난 상태에서 중심으로부터의 거리
const DURATION = 650;

const TOKENS = [
  "--surface",
  "--fg",
  "--muted",
  "--m-blue",
  "--m-chip",
  "--m-accent",
  "--m-accent-text",
  "--m-ok-text",
] as const;

const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

interface Props {
  caption?: string;
}

export function DigestMatchDemo({ caption }: Props) {
  const [pushed, setPushed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tokens = useCanvasTokens(canvasRef, TOKENS);
  const boxWidth = useContainerWidth(boxRef);
  const groupName = useId();
  // 현재 그려진 t. null이면 아직 한 번도 안 그렸다는 뜻 — 마운트·테마 전환은 즉시 그린다
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tokens || boxWidth === 0) return;

    // 폭은 컨테이너가 정한다 — 모바일에서는 칩이 함께 줄어든다
    const W = Math.min(MAX_W, boxWidth);
    const CHIP_W = Math.min(320, W - 24);
    const cx = W / 2;
    const cy = H / 2;

    const chip = (
      ctx: CanvasRenderingContext2D,
      y: number,
      label: string,
      digest: string,
      alpha = 1
    ) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.roundRect(cx - CHIP_W / 2, y - CHIP_H / 2, CHIP_W, CHIP_H, 10);
      ctx.fillStyle = tokens["--m-chip"];
      ctx.fill();
      ctx.strokeStyle = tokens["--m-blue"];
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = tokens["--muted"];
      ctx.font = `600 10px ${MONO}`;
      ctx.textAlign = "left";
      ctx.fillText(label, cx - CHIP_W / 2 + 14, y - 6);
      ctx.fillStyle = tokens["--fg"];
      ctx.font = `12px ${MONO}`;
      ctx.fillText(digest, cx - CHIP_W / 2 + 14, y + 11);
      ctx.globalAlpha = 1;
    };

    /* t: 0 = 어긋남(2개) · 1 = 일치(1개). ring은 일치 직후의 확인 링 진행도 */
    const draw = (t: number, ring: number) => {
      const ctx = setupCanvas(canvas, W, H);
      if (!ctx) return;
      ctx.fillStyle = tokens["--surface"];
      ctx.fillRect(0, 0, W, H);

      if (t < 1) {
        const gap = APART * (1 - t);
        chip(ctx, cy - gap, "빌드가 만든 것", shortDigest(MANIFEST_DIGEST.push), 1);
        // 아래 칩은 수렴하며 위 칩에 겹쳐 사라진다 — 2개가 1개가 되는 그 순간
        chip(
          ctx,
          cy + gap,
          "레지스트리에 올라간 것",
          shortDigest(MANIFEST_DIGEST.load),
          1 - t * 0.85
        );
        if (t < 0.15) {
          ctx.fillStyle = tokens["--m-accent-text"];
          ctx.font = "700 15px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("≠", Math.min(cx + CHIP_W / 2 + 22, W - 14), cy + 5);
        }
      } else {
        chip(ctx, cy, "빌드가 만든 것 = 레지스트리에 올라간 것", shortDigest(MANIFEST_DIGEST.push), 1);
        if (ring > 0 && ring < 1) {
          // 확인 링 — 일치의 쾌감. 퍼지면서 옅어진다
          ctx.globalAlpha = 1 - ring;
          ctx.strokeStyle = tokens["--m-ok-text"];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(
            cx - CHIP_W / 2 - ring * 26,
            cy - CHIP_H / 2 - ring * 26,
            CHIP_W + ring * 52,
            CHIP_H + ring * 52,
            10 + ring * 18
          );
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = tokens["--m-ok-text"];
        ctx.font = "700 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("일치", cx, cy + CHIP_H / 2 + 26);
      }
    };

    const target = pushed ? 1 : 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    // 마운트 직후·테마 전환·모션 축소에서는 애니메이션 없이 현재 상태를 그대로 그린다.
    // 없으면 첫 프레임이 반대쪽 끝에서 시작해 라디오·aria와 화면이 모순된다.
    if (tRef.current === null || tRef.current === target || reduce.matches) {
      tRef.current = target;
      draw(target, 0);
      return;
    }

    const from = tRef.current;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      // 진행 중 OS가 모션 축소를 켜면 즉시 최종 상태로
      if (reduce.matches) {
        tRef.current = target;
        draw(target, 0);
        return;
      }
      const p = Math.min((now - start) / DURATION, 1);
      const eased = 1 - (1 - p) ** 3;
      const t = from + (target - from) * eased;
      tRef.current = t;
      draw(t, 0);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (target === 1) {
        // 수렴이 끝난 뒤 확인 링이 같은 길이로 한 번 퍼진다
        const ringStart = performance.now();
        const ringTick = (n: number) => {
          const rp = Math.min((n - ringStart) / DURATION, 1);
          draw(1, rp);
          if (rp < 1) raf = requestAnimationFrame(ringTick);
        };
        raf = requestAnimationFrame(ringTick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tokens, pushed, boxWidth]);

  return (
    <figure className="m-parcel my-8">
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
        <fieldset className="border-0 m-0 p-5 pb-4 border-b border-[color:var(--border-strong)]">
          <legend className="float-left w-full text-[13px] text-[color:var(--muted)] mb-3 px-0">
            처음의 로그로 돌아가서
          </legend>
          <div className="clear-both flex flex-wrap gap-2">
            {[
              { v: false, label: "--load", hint: "지금은 sha256이 두 개" },
              { v: true, label: "--push", hint: "전환하면 하나" },
            ].map((o) => (
              <label
                key={o.label}
                className="flex-1 min-w-[170px] cursor-pointer rounded-xl border px-3 py-2 transition-colors has-[:checked]:border-[color:var(--link)] has-[:checked]:bg-[color:var(--surface-2)] border-[color:var(--border)] hover:bg-[color:var(--hover-bg)]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={groupName}
                    checked={pushed === o.v}
                    onChange={() => setPushed(o.v)}
                    className="accent-[color:var(--link)]"
                  />
                  <code className="text-[13px] font-semibold text-[color:var(--fg)]">
                    {o.label}
                  </code>
                </span>
                <span className="block text-[12px] text-[color:var(--muted)] mt-1 pl-6">
                  {o.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div ref={boxRef} className="px-5 py-4">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={
              pushed
                ? `--push 전환 후: 빌드와 레지스트리의 digest가 ${shortDigest(MANIFEST_DIGEST.push)} 하나로 일치한다`
                : `--load 상태: 빌드가 만든 ${shortDigest(MANIFEST_DIGEST.push)}와 레지스트리에 올라간 ${shortDigest(MANIFEST_DIGEST.load)}가 서로 다르다`
            }
            className="block mx-auto"
          />
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border-strong)] bg-[color:var(--surface-2)]">
          <p className="text-[13px] m-0 leading-6">
            {pushed ? (
              <span className="text-[color:var(--m-ok-text)] font-semibold">
                빌드 로그의 digest = 레지스트리의 digest.
              </span>
            ) : (
              <span className="text-[color:var(--m-accent-text)] font-semibold">
                <span aria-hidden="true">{shortDigest(MANIFEST_DIGEST.push)}</span>
                <span className="sr-only">{MANIFEST_DIGEST.push}</span> ≠{" "}
                <span aria-hidden="true">{shortDigest(MANIFEST_DIGEST.load)}</span>
                <span className="sr-only">{MANIFEST_DIGEST.load}</span>
              </span>
            )}{" "}
            <span className="text-[color:var(--muted)]">
              {pushed
                ? "재포장이 사라졌으니 지문이 갈릴 자리도 사라졌다. 증명서 동봉을 끈 우리 설정에서는, 처음의 미스터리가 이렇게 닫힌다."
                : "글을 연 그 두 줄이다."}
            </span>
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[color:var(--muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
