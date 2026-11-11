import { z } from "zod";

export const ANIMATION_PRESET_IDS = ["luxury", "minimal", "bold", "creative"] as const;
export type AnimationPresetId = (typeof ANIMATION_PRESET_IDS)[number];

const bezier = z.tuple([z.number(), z.number(), z.number(), z.number()]);

export const animationPresetSchema = z.object({
  id: z.enum(ANIMATION_PRESET_IDS),
  label: z.string(),
  description: z.string(),
  /** Base duration in seconds (scaled by `durationScale`). */
  duration: z.number().positive(),
  delay: z.number().min(0),
  stagger: z.number().min(0),
  ease: z.object({ css: bezier, gsap: z.string() }),
  /** Entrance used by Motion fade/stagger components. */
  reveal: z.object({ y: z.number(), scale: z.number(), blur: z.number().min(0) }),
  /** GSAP SplitText reveals. */
  text: z.object({ split: z.enum(["lines", "words", "chars"]), yPercent: z.number(), rotate: z.number() }),
  /** GSAP clip-path image reveals. */
  image: z.object({ clip: z.enum(["up", "left", "center", "none"]), scale: z.number().min(1) }),
  /** Parallax travel as a % of the element height (0 disables). */
  parallax: z.number().min(0).max(20),
  hover: z.object({ scale: z.number(), lift: z.number() }),
  scroll: z.object({ start: z.string(), scrub: z.union([z.boolean(), z.number()]), once: z.boolean() }),
  /** Pin + horizontally scroll the editorial story on large screens. */
  horizontalStory: z.boolean(),
  /** Seconds for one marquee loop. */
  marqueeDuration: z.number().positive(),
});

export const animationConfigSchema = z.object({
  enabled: z.boolean(),
  preset: z.enum(ANIMATION_PRESET_IDS),
  durationScale: z.number().min(0.25).max(3),
  /** Shallow per-key overrides on top of the preset (e.g. { parallax: 6 }). */
  overrides: animationPresetSchema.omit({ id: true, label: true, description: true }).partial().optional(),
  smoothScroll: z.object({
    enabled: z.boolean(),
    lerp: z.number().min(0.01).max(1),
    wheelMultiplier: z.number().positive(),
  }),
});

export type AnimationPreset = z.infer<typeof animationPresetSchema>;
export type AnimationConfig = z.infer<typeof animationConfigSchema>;
export type ResolvedAnimation = Omit<AnimationPreset, "id"> & {
  preset: AnimationPresetId;
  enabled: boolean;
  durationScale: number;
  smoothScroll: AnimationConfig["smoothScroll"];
};
