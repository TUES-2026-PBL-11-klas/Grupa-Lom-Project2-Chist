import type { T } from "../i18n.ts";

interface FilterChipsProps {
  active: string;
  onChange: (id: string) => void;
  i: T;
}

export default function FilterChips({ active, onChange, i }: FilterChipsProps) {
  const filters = [
    { id: "all", label: i.filterAll, dot: "#FFFFFF" },
    { id: "critical", label: i.filterCritical, dot: "#EF4444" },
    { id: "high", label: i.filterSerious, dot: "#F97316" },
    { id: "open", label: i.filterOpen, dot: "#60A5FA" },
    { id: "done", label: i.filterDone, dot: "#22C55E" },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {filters.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-[13px] tracking-wide
              font-[DM_Sans,sans-serif]
              border transition-all duration-200 cursor-pointer
              ${isActive
                ? "bg-pink-primary/20 border-pink-primary/50 text-white shadow-[0_0_16px_rgba(255,77,148,0.25)]"
                : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/70"
              }
            `}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: f.dot,
                boxShadow: isActive ? `0 0 8px ${f.dot}` : "none",
              }}
            />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
