/**
 * Brand line-art motifs (viewBox 1200 × 120, centre 600,60). Every path with `data-draw` is
 * drawn on scroll; vines start at the centre so the motif grows outward.
 * Running stitches (kantha) are dashed paths revealed through a drawn mask, because the
 * draw effect itself uses the dash pattern.
 */

export type MotifId = "kantha" | "floral" | "deco";

const mirror = "translate(1200 0) scale(-1 1)";

function Kantha({ uid }: { uid: string }) {
  const vine = "M588 60 C548 60 528 38 488 38 C448 38 436 80 396 80 C356 80 344 42 304 42 C264 42 252 74 212 74 C172 74 160 50 120 54 C84 58 56 60 10 60";
  const leaves = ["M488 38 q-6 -18 -24 -18 q4 16 24 18", "M396 80 q-4 18 -22 20 q2 -16 22 -20", "M304 42 q-6 -18 -24 -18 q4 16 24 18", "M212 74 q-4 18 -22 20 q2 -16 22 -20"];
  const stitchRow = "M40 104 H560";
  const petal = "M600 60 C590 42 593 26 600 18 C607 26 610 42 600 60";
  return (
    <>
      <defs>
        <mask id={`${uid}-stitch`} maskUnits="userSpaceOnUse">
          <path data-draw d={stitchRow} stroke="#fff" strokeWidth="8" fill="none" />
          <path data-draw d={stitchRow} transform={mirror} stroke="#fff" strokeWidth="8" fill="none" />
          <path data-draw d="M40 16 H560" stroke="#fff" strokeWidth="8" fill="none" />
          <path data-draw d="M40 16 H560" transform={mirror} stroke="#fff" strokeWidth="8" fill="none" />
        </mask>
      </defs>
      <g mask={`url(#${uid}-stitch)`} strokeDasharray="7 7" strokeWidth="1.4">
        <path d={stitchRow} />
        <path d={stitchRow} transform={mirror} />
        <path d="M40 16 H560" />
        <path d="M40 16 H560" transform={mirror} />
      </g>
      {[0, 1].map((m) => (
        <g key={m} transform={m ? mirror : undefined}>
          <path data-draw d={vine} />
          {leaves.map((d) => (
            <path key={d} data-draw d={d} />
          ))}
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} data-draw d={petal} transform={`rotate(${i * 45} 600 60)`} />
      ))}
      <circle data-draw cx="600" cy="60" r="7" />
    </>
  );
}

function Floral() {
  const vine = "M588 60 C562 34 528 88 482 62 S396 34 344 60 S252 88 196 60 S104 42 10 60";
  const buds = ["M482 62 c-8 -14 -2 -26 10 -28 c2 12 -2 22 -10 28", "M344 60 c-8 14 -2 26 10 28 c2 -12 -2 -22 -10 -28", "M196 60 c-8 -14 -2 -26 10 -28 c2 12 -2 22 -10 28"];
  const petal = "M600 60 C584 48 584 30 600 24 C616 30 616 48 600 60";
  return (
    <>
      {[0, 1].map((m) => (
        <g key={m} transform={m ? mirror : undefined}>
          <path data-draw d={vine} />
          {buds.map((d) => (
            <path key={d} data-draw d={d} />
          ))}
        </g>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} data-draw d={petal} transform={`rotate(${i * 72} 600 60)`} />
      ))}
      <circle data-draw cx="600" cy="60" r="4" />
    </>
  );
}

function Deco() {
  return (
    <>
      <path data-draw d="M572 60 H40" />
      <path data-draw d="M628 60 H1160" />
      <path data-draw d="M600 42 L618 60 L600 78 L582 60 Z" />
      <path data-draw d="M600 50 L610 60 L600 70 L590 60 Z" />
      <circle data-draw cx="566" cy="60" r="3" />
      <circle data-draw cx="634" cy="60" r="3" />
    </>
  );
}

export function MotifArt({ motif, uid }: { motif: MotifId; uid: string }) {
  if (motif === "kantha") return <Kantha uid={uid} />;
  if (motif === "floral") return <Floral />;
  return <Deco />;
}
