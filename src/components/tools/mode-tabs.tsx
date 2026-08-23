"use client";

/**
 * Segmented control for switching between a tool's input modes
 * (pasted text vs. uploaded document).
 */
export function ModeTabs({
  value,
  onChange,
  tabs,
}: {
  value: string;
  onChange: (value: string) => void;
  tabs: { value: string; label: string; badge?: string }[];
}) {
  return (
    <div role="tablist" className="mx-auto inline-flex rounded-full border border-slate-200/80 bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-slate-950 text-white shadow" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
            {tab.badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  active ? "bg-white/15 text-violet-200" : "bg-violet-50 text-violet-600"
                }`}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
