import { defineAnimation } from "../types";

export default defineAnimation({
  enabled: true,
  preset: "luxury",
  durationScale: 0.85,
  overrides: { parallax: 6 },
  smoothScroll: { enabled: true, lerp: 0.1, wheelMultiplier: 1 },
});
