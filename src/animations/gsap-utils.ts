"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, client-side only. Import GSAP from here everywhere so plugins are always registered.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
