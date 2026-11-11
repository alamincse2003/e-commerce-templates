import { defineAnimation } from "../types";

export default defineAnimation({
  enabled: true,
  preset: "luxury",
  durationScale: 1,
  smoothScroll: { enabled: true, lerp: 0.09, wheelMultiplier: 1 },
});
