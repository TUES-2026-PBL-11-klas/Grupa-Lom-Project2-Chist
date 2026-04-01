import FilterChips from "./FilterChips.tsx";
import SignalCard from "./SignalCard.tsx";
import type { T } from "../i18n.ts";

interface Report {
  id: number;
  title: string;
  location: string;
  severity: string;
  status: string;
  img: string;
  time: string;
  points: number;
  [key: string]: unknown;
}

interface SidebarProps {
  reports: Report[];
  allReports: Report[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedId: number | null;
  onSelectReport: (id: number) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  i: T;
}

export default function Sidebar({
  reports,
  allReports,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedId,
  onSelectReport,
  mobileOpen,
  onMobileClose,
  i,
}: SidebarProps) {
  const totalSignals = allReports.length;
  const streakDays = 7;

  const legend = [
    { label: i.legendCritical, color: "#EF4444" },
    { label: i.legendSerious, color: "#F97316" },
    { label: i.legendMedium, color: "#EAB308" },
    { label: i.legendLowDone, color: "#22C55E" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-[380px] z-40
          bg-bg-base/95 backdrop-blur-xl
          border-r border-white/[0.06]
          flex flex-col
          transition-transform duration-300 ease-out
          md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile drag handle */}
        <div className="flex items-center justify-center py-2 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 px-7 py-5 border-b border-white/[0.06]">
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <span className="font-[Bebas_Neue,sans-serif] text-4xl font-bold text-white tracking-[3px]">
                {totalSignals.toLocaleString()}
              </span>
              <span className="font-[DM_Sans,sans-serif] text-[13px] text-pink-primary uppercase tracking-widest font-semibold">
                {i.signals}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-orange-400 text-base">🔥</span>
            <span className="font-[DM_Sans,sans-serif] text-sm font-bold text-orange-300">
              {streakDays} {i.days}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-7 py-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={i.searchPlaceholder}
              className="font-[DM_Sans,sans-serif] w-full pl-12 pr-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[15px] text-white placeholder-white/30 outline-none focus:border-pink-primary/50 focus:shadow-[0_0_0_3px_rgba(255,77,148,0.1)] transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-7 pb-4">
          <div className="font-[DM_Sans,sans-serif] text-[10px] tracking-[3px] text-white/20 uppercase mb-3 font-semibold">
            {i.filterLabel}
          </div>
          <FilterChips active={activeFilter} onChange={onFilterChange} i={i} />
        </div>

        {/* Legend */}
        <div className="px-7 py-4 border-t border-white/[0.04]">
          <div className="font-[DM_Sans,sans-serif] text-[10px] tracking-[3px] text-white/20 uppercase mb-3 font-semibold">
            {i.legendLabel}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}70`,
                  }}
                />
                <span className="font-[DM_Sans,sans-serif] text-[12px] text-white/45">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signal cards list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 scrollbar-thin">
          <div className="font-[DM_Sans,sans-serif] text-[10px] tracking-[3px] text-white/20 uppercase mb-2 px-2 font-semibold">
            {i.recentSignals} ({reports.length})
          </div>
          {reports.map((report) => (
            <SignalCard
              key={report.id}
              report={report}
              isSelected={selectedId === report.id}
              onClick={() => onSelectReport(report.id)}
              i={i}
            />
          ))}
          {reports.length === 0 && (
            <div className="text-center py-10 text-white/20 text-base font-[DM_Sans,sans-serif]">
              {i.noResults}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
