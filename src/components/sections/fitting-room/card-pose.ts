/**
 * Cards fan out on both sides of the mirror like a curved wardrobe.
 * d = distance from the carousel head; first half goes right, the rest wraps to the left.
 */
export function cardSlot(i: number, head: number, n: number) {
  const d = (((i - head) % n) + n) % n;
  const right = Math.ceil(n / 2);
  return d < right ? { side: 1 as const, depth: d } : { side: -1 as const, depth: n - 1 - d };
}

export function cardPose(side: 1 | -1, depth: number, stageWidth: number) {
  const x = side * stageWidth * (0.235 + depth * 0.11);
  return {
    x,
    rotateY: -side * (24 + depth * 10),
    scale: 1 - depth * 0.15,
    opacity: depth > 2 ? 0 : 1 - depth * 0.28,
    zIndex: 10 - depth,
  };
}
