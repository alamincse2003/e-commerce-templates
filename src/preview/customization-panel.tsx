"use client";

import { Check, Copy, Palette, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ANIMATION_PRESETS } from "@/animations/animation-presets";
import { useAnimationConfig } from "@/animations/animation-provider";
import { FONT_KEYS, FONT_META, fontStack, type FontKey } from "@/config/fonts.meta";
import { ANIMATION_PRESET_IDS } from "@/config/schema/animation";
import type { Theme } from "@/config/schema/theme";
import { THEME_PRESET_IDS, THEME_PRESETS } from "@/config/themes";
import { usePreviewStore, type PreviewThemeId } from "@/store/preview-store";
import { applyThemeOverrides, type ColorOverrideKey } from "@/theme/apply-overrides";
import { ColorField, PanelSection, Segmented, SelectField, Toggle } from "./panel-controls";

const COLOR_FIELDS: { key: ColorOverrideKey; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Text" },
];

const fontOptions = FONT_KEYS.map((k) => ({ value: k, label: FONT_META[k].label }));

export default function CustomizationPanel({ clientTheme, clientName }: { clientTheme: Theme; clientName: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const a = useAnimationConfig();
  const s = usePreviewStore(
    useShallow((st) => ({
      themeId: st.themeId,
      colors: st.colors,
      fonts: st.fonts,
      animation: st.animation,
      setTheme: st.setTheme,
      setColor: st.setColor,
      setFont: st.setFont,
      setAnimation: st.setAnimation,
      reset: st.reset,
    })),
  );

  const base = s.themeId === "client" ? clientTheme : THEME_PRESETS[s.themeId];
  const effective = applyThemeOverrides(base, { colors: s.colors, fonts: s.fonts });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const copyConfig = async () => {
    const { id: _id, name: _name, description: _d, ...tokens } = effective;
    await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const themeChoices: { id: PreviewThemeId; theme: Theme; label: string }[] = [
    { id: "client", theme: clientTheme, label: clientName },
    ...THEME_PRESET_IDS.map((id) => ({ id, theme: THEME_PRESETS[id], label: THEME_PRESETS[id].name })),
  ];

  const motionToggleOn = s.animation.enabled ?? a.enabled;

  return (
    <div className="font-sans [font-family:ui-sans-serif,system-ui,sans-serif]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="preview-panel"
        aria-label="Customize theme and animation"
        className="fixed right-4 bottom-4 z-[75] flex items-center gap-2 rounded-full bg-zinc-950 p-3 text-xs text-white shadow-2xl ring-1 ring-white/15 transition-transform hover:scale-105 sm:right-5 sm:bottom-5 sm:px-4"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Customize</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            id="preview-panel"
            aria-label="Theme and animation customization"
            data-lenis-prevent
            className="fixed top-3 right-3 bottom-3 z-[95] flex w-[min(340px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl bg-zinc-950/95 text-zinc-100 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <header className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium">Customize</p>
                <p className="text-[11px] text-zinc-400">Preview only · saved in this browser</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close panel" className="rounded-full p-2 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <PanelSection title="Theme">
                <div className="grid grid-cols-2 gap-2">
                  {themeChoices.map(({ id, theme, label }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={s.themeId === id}
                      onClick={() => s.setTheme(id)}
                      className={`rounded-xl p-2 text-left ring-1 transition ${s.themeId === id ? "ring-white" : "ring-white/10 hover:ring-white/30"} ${id === "client" ? "col-span-2" : ""}`}
                    >
                      <span className="flex h-12 items-end justify-between rounded-lg px-2.5 pb-1.5" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
                        <span className="text-xl leading-none" style={{ fontFamily: fontStack(theme.typography.display) }}>
                          Aa
                        </span>
                        <span className="flex gap-1">
                          {[theme.colors.primary, theme.colors.accent, theme.colors.secondary].map((c, i) => (
                            <span key={i} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                          ))}
                        </span>
                      </span>
                      <span className="mt-1.5 block truncate text-[11px] text-zinc-300">{id === "client" ? `${label} (client)` : label}</span>
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection title="Colors">
                {COLOR_FIELDS.map((f) => (
                  <ColorField key={f.key} label={f.label} value={effective.colors[f.key]} onChange={(v) => s.setColor(f.key, v)} />
                ))}
              </PanelSection>

              <PanelSection title="Typography">
                <SelectField<FontKey> label="Display" value={effective.typography.display} options={fontOptions} onChange={(v) => s.setFont("display", v)} />
                <SelectField<FontKey> label="Headings" value={effective.typography.heading} options={fontOptions} onChange={(v) => s.setFont("heading", v)} />
                <SelectField<FontKey> label="Body" value={effective.typography.body} options={fontOptions} onChange={(v) => s.setFont("body", v)} />
              </PanelSection>

              <PanelSection title="Animation">
                <Segmented
                  value={a.preset}
                  options={ANIMATION_PRESET_IDS.map((id) => ({ value: id, label: ANIMATION_PRESETS[id].label }))}
                  onChange={(preset) => s.setAnimation({ preset })}
                />
                <p className="mt-2 text-[11px] text-zinc-400">{ANIMATION_PRESETS[a.preset].description}</p>
                <label className="mt-4 block text-xs text-zinc-200">
                  <span className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-mono text-zinc-400">{a.durationScale.toFixed(2)}×</span>
                  </span>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={a.durationScale}
                    onChange={(e) => s.setAnimation({ durationScale: Number(e.target.value) })}
                    className="mt-2 w-full accent-white"
                  />
                </label>
                <div className="mt-3">
                  <Toggle
                    label="Animations"
                    checked={motionToggleOn}
                    onChange={(enabled) => s.setAnimation({ enabled })}
                    hint={a.reducedMotion ? "Your OS requests reduced motion — animations stay off." : undefined}
                  />
                  <Toggle label="Smooth scrolling (Lenis)" checked={a.smoothScroll.enabled} onChange={(smoothScroll) => s.setAnimation({ smoothScroll })} />
                </div>
              </PanelSection>
            </div>

            <footer className="grid grid-cols-2 gap-2 border-t border-white/10 p-4">
              <button type="button" onClick={s.reset} className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-xs hover:bg-white/10">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button type="button" onClick={copyConfig} className="flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs text-zinc-900 hover:bg-zinc-200">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy theme"}
              </button>
            </footer>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
