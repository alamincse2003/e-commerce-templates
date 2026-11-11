import { defineAnimation } from "../types";

export default defineAnimation({
  enabled: true,
  preset: "creative",
  durationScale: 1.1,
  overrides: { parallax: 12 },
  smoothScroll: { enabled: true, lerp: 0.08, wheelMultiplier: 0.9 },
});
