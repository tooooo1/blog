"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/*
  데모 공용 자동 재생. 화면에 들어오면 시작하고, 마지막 장면에서 쉬었다가 처음부터 반복한다.
  delays[i]는 i번 장면을 보여 주는 시간이고 길이가 곧 장면 수다.
  prefers-reduced-motion에서는 reducedStep 장면만 정지 상태로 보여준다.
*/

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function useAutoplay(delays: readonly number[], reducedStep: number) {
  const [rawStep, setStep] = useState(0);
  // 한 바퀴마다 올린다. 그림을 이 값으로 다시 마운트해서 처음 장면으로 돌아갈 때
  // 전환이 거꾸로 재생되지 않게 한다(애니메이션은 늘 한 방향).
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  // SSR 스냅숏은 false
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !visible) return;
    const last = delays.length - 1;
    const timer = setTimeout(() => {
      if (rawStep >= last) {
        setCycle((c) => c + 1);
        setStep(0);
      } else {
        setStep(rawStep + 1);
      }
    }, delays[rawStep] ?? 1000);
    return () => clearTimeout(timer);
  }, [rawStep, visible, reduced, delays]);

  return { rootRef, step: reduced ? reducedStep : rawStep, cycle };
}
