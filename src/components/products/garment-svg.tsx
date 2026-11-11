import { useId } from "react";
import type { Garment } from "@/config/schema/catalog";

/**
 * Illustrated garment on a hanger. Colors come from product data (the garment's own colorway),
 * prints use the theme's logo font — so the rail re-skins with every client.
 * viewBox: 200 × 320. Hanger hook at the top centre (100, 0) — the swing pivot.
 */

const TEE = "M74 58 Q100 80 126 58 L162 70 L196 112 L172 130 L157 108 L159 300 Q100 307 41 300 L43 108 L28 130 L4 112 L38 70 Z";
const LONG = "M74 58 Q100 80 126 58 L160 70 Q178 78 182 112 L194 272 L170 276 L157 124 L159 300 Q100 307 41 300 L43 124 L30 276 L6 272 L18 112 Q22 78 40 70 Z";
const VARSITY_BODY = "M74 58 Q100 80 126 58 L157 68 L159 300 Q100 307 41 300 L43 68 Z";
const HOOD = "M64 66 Q60 26 100 22 Q140 26 136 66 Q120 92 100 94 Q80 92 64 66 Z";

/** Bangladeshi panjabi: knee-length tunic, band collar, button placket, side slits. */
const PANJABI = "M80 56 L120 56 L160 68 Q178 76 182 110 L192 262 L170 266 L158 124 L160 318 Q100 322 40 318 L42 124 L30 266 L8 262 L18 110 Q22 76 40 68 Z";

const outline = (type: Garment["type"]) => (type === "tee" ? TEE : type === "panjabi" ? PANJABI : LONG);

function Print({ print, id }: { print: NonNullable<Garment["print"]>; id: string }) {
  const style = { fontFamily: "var(--t-font-logo)" };
  switch (print.kind) {
    case "wordmark":
      return (
        <text x="100" y="150" textAnchor="middle" fontSize={print.text.length > 6 ? 17 : 22} fill={print.color} style={style}>
          {print.text}
        </text>
      );
    case "arch":
      return (
        <>
          <path id={`${id}-arc`} d="M48 176 Q100 118 152 176" fill="none" />
          <text fontSize={print.text.length > 12 ? 13 : 16} fill={print.color} style={style} letterSpacing="1">
            <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
              {print.text}
            </textPath>
          </text>
        </>
      );
    case "emblem":
      return (
        <g>
          <circle cx="128" cy="128" r="15" fill="none" stroke={print.color} strokeWidth="1.5" />
          <text x="128" y="133" textAnchor="middle" fontSize="13" fill={print.color} style={style}>
            {print.text}
          </text>
        </g>
      );
    case "big":
      return (
        <text x="100" y={print.text.length > 2 ? 190 : 205} textAnchor="middle" fontSize={print.text.length > 2 ? 30 : 84} fill={print.color} style={style}>
          {print.text}
        </text>
      );
  }
}

export function GarmentSvg({ garment, className, showHanger = true }: { garment: Garment; className?: string; showHanger?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const shade = `${uid}-shade`;
  const fall = `${uid}-fall`;
  const wood = `${uid}-wood`;
  const path = outline(garment.type);
  const hooded = garment.type === "hoodie" || garment.type === "zip-hoodie";
  const trim = garment.trim ?? garment.base;

  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden>
      <defs>
        <linearGradient id={shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".32" />
          <stop offset=".2" stopColor="#000" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".07" />
          <stop offset=".8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={fall} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id={wood} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D3A574" />
          <stop offset="1" stopColor="#8F6239" />
        </linearGradient>
      </defs>

      {showHanger ? (
        <g>
          <path d="M100 48 V30 C100 21 111 20 111 11 C111 4 105 1 100 1 C95 1 91 4 91 9" fill="none" stroke="#B9B9B9" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 70 C62 54 82 48 100 46 C118 48 138 54 174 70" fill="none" stroke={`url(#${wood})`} strokeWidth="7" strokeLinecap="round" />
        </g>
      ) : null}

      {hooded ? <path d={HOOD} fill={garment.base} /> : null}
      {hooded ? <path d={HOOD} fill="#000" opacity=".22" /> : null}

      {garment.type === "varsity" ? (
        <>
          <path d={path} fill={trim} />
          <path d={VARSITY_BODY} fill={garment.base} />
        </>
      ) : (
        <path d={path} fill={garment.base} />
      )}
      <path d={path} fill={`url(#${shade})`} />
      <path d={path} fill={`url(#${fall})`} />

      {/* Folds */}
      <g fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="1.4" strokeLinecap="round">
        <path d="M68 150 Q75 226 64 292" />
        <path d="M134 156 Q126 232 138 294" />
        <path d="M100 210 Q104 254 98 298" strokeOpacity=".07" />
      </g>

      {/* Neck / collar */}
      {garment.type === "panjabi" ? (
        <g>
          <path d="M79 48 L121 48 L123 60 L77 60 Z" fill={garment.base} stroke="#000" strokeOpacity=".25" />
          <path d="M100 60 V152" stroke="#000" strokeOpacity=".22" strokeWidth="1.2" />
          {[76, 94, 112, 130].map((y) => (
            <circle key={y} cx="104" cy={y} r="2.2" fill={garment.trim ?? "#000"} fillOpacity={garment.trim ? 1 : 0.35} />
          ))}
          {garment.trim ? (
            <g fill="none" stroke={garment.trim} strokeWidth="1.4" strokeDasharray="2 2.5">
              <path d="M78 54 H122" />
              <path d="M94 62 V152 M108 62 V152" />
              <path d="M42 312 Q100 316 158 312" />
            </g>
          ) : null}
          <path d="M42 276 L40 318 M158 276 L160 318" stroke="#000" strokeOpacity=".22" strokeWidth="1.2" />
        </g>
      ) : garment.type === "coach-jacket" ? (
        <path d="M74 58 L100 96 L126 58 L136 74 L100 104 L64 74 Z" fill={garment.base} stroke="#000" strokeOpacity=".2" />
      ) : (
        <path d="M74 58 Q100 80 126 58" fill="none" stroke={trim} strokeWidth="5" strokeOpacity={garment.trim ? 1 : 0.5} />
      )}

      {hooded ? (
        <g>
          <path d="M80 64 Q100 98 120 64" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="2" />
          <path d="M92 84 L89 134 M108 84 L111 132" stroke="#EDE9E1" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ) : null}

      {garment.type === "hoodie" ? <path d="M60 214 L140 214 L152 262 L48 262 Z" fill="#000" opacity=".1" stroke="#000" strokeOpacity=".16" /> : null}

      {garment.type === "zip-hoodie" || garment.type === "coach-jacket" || garment.type === "varsity" ? (
        <path d="M100 96 V302" stroke="#000" strokeOpacity=".3" strokeWidth={garment.type === "zip-hoodie" ? 2.4 : 1.2} />
      ) : null}
      {garment.type === "varsity" || garment.type === "coach-jacket"
        ? [118, 150, 182, 214, 246].map((y) => <circle key={y} cx="104" cy={y} r="2.6" fill={garment.type === "varsity" ? trim : "#2a2a2a"} />)
        : null}

      {/* Ribbed hem + cuffs for long-sleeve types */}
      {garment.type === "varsity" ? <rect x="41" y="286" width="118" height="14" fill={trim} /> : null}
      {garment.type !== "tee" && garment.type !== "panjabi" ? (
        <g stroke="#000" strokeOpacity=".18" strokeWidth="1.2">
          <path d="M42 286 H158" />
          <path d="M8 258 L32 262 M168 262 L192 258" />
        </g>
      ) : null}
      {garment.type === "varsity" ? (
        <g stroke={garment.base} strokeWidth="2.4">
          <path d="M41 292 H159" />
          <path d="M8 264 L31 268 M169 268 L192 264" />
        </g>
      ) : null}

      {garment.print ? <Print print={garment.print} id={uid} /> : null}
    </svg>
  );
}
