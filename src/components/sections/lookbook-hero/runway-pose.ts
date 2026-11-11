/**
 * Where each look stands on the runway, by its distance `k` from the active look.
 * k=0 is centre stage, 1..3 queue up to the left (smaller, blurred — receding in depth),
 * k=n-1 is the look that just walked off to the right.
 * x is a % of the card's own width; the card scales from its bottom centre (feet on the floor).
 */
export type Pose = { x: string; scale: number; opacity: number; filter: string; zIndex: number };

const QUEUE = [
  { x: -50, scale: 1, opacity: 1, blur: 0 },
  { x: -118, scale: 0.8, opacity: 0.75, blur: 2 },
  { x: -170, scale: 0.63, opacity: 0.5, blur: 4 },
  { x: -212, scale: 0.5, opacity: 0.28, blur: 6 },
];

export function runwayPose(k: number, total: number): Pose {
  if (k === 0 || (k > 0 && k < QUEUE.length && k < total - 1)) {
    const q = QUEUE[k];
    return { x: `${q.x}%`, scale: q.scale, opacity: q.opacity, filter: `blur(${q.blur}px)`, zIndex: 10 - k };
  }
  if (k === total - 1) {
    // Just walked off stage, to the right.
    return { x: "40%", scale: 1.06, opacity: 0, filter: "blur(0px)", zIndex: 11 };
  }
  // Waiting in the wings.
  return { x: "-250%", scale: 0.4, opacity: 0, filter: "blur(8px)", zIndex: 1 };
}

export const wrap = (i: number, n: number) => ((i % n) + n) % n;
