import { defineAnimation } from "../types";

export default defineAnimation({
  enabled: true,
  preset: "bold",
  durationScale: 1,
  smoothScroll: { enabled: true, lerp: 0.12, wheelMultiplier: 1.1 },
});
