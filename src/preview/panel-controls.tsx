"use client";

/** Neutral, theme-independent controls for the preview panel (intentionally not brand-themed). */

export function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 px-5 py-5">
      <h3 className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-zinc-400 uppercase">{title}</h3>
      {children}
    </section>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-xs text-zinc-200">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-zinc-400 uppercase">{value}</span>
        <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/20" style={{ background: value }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={`${label} color`} />
        </span>
      </span>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-xs text-zinc-200">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-40 rounded-md border border-white/15 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-white/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="py-1.5">
      <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-zinc-200">
        <span>{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-white" : "bg-zinc-700"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform ${checked ? "translate-x-4 bg-zinc-900" : "bg-zinc-300"}`} />
        </button>
      </label>
      {hint ? <p className="mt-1 text-[10px] text-amber-300/80">{hint}</p> : null}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg bg-zinc-900 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-1 py-1.5 text-[11px] transition-colors ${value === o.value ? "bg-white text-zinc-900" : "text-zinc-300 hover:bg-white/10"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
