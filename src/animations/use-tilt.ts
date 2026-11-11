"use client";

import { useCallback, useRef } from "react";
import { useAnimationConfig } from "./animation-provider";

/**
 * 2.5D tilt: the element leans toward the pointer and exposes --sx/--sy for a light sheen.
 * Mouse-only (no effect on touch), disabled with motion off. Writes CSS variables directly,
 * so it never re-renders React and costs one rAF per pointer move.
 */
export function useTilt(maxDeg = 5) {
  const a = useAnimationConfig();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!a.enabled || e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width; // 0..1
        const py = (clientY - r.top) / r.height;
        el.style.setProperty("--rx", `${(0.5 - py) * maxDeg * 2}deg`);
        el.style.setProperty("--ry", `${(px - 0.5) * maxDeg * 2}deg`);
        el.style.setProperty("--sx", `${px * 100}%`);
        el.style.setProperty("--sy", `${py * 100}%`);
      });
    },
    [a.enabled, maxDeg],
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    cancelAnimationFrame(frame.current);
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave, enabled: a.enabled };
}
