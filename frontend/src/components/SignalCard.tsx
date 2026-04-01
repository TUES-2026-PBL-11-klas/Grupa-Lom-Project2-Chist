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
}

interface SignalCardProps {
  report: Report;
  isSelected: boolean;
  onClick: () => void;
  i: T;
}

const SEV_COLORS: Record<string, string> = {
  critical: "#f43f5e",
  high: "#fb923c",
  medium: "#f59e0b",
  low: "#34d399",
};

const STATUS_COLORS: Record<string, string> = {
  open: "#60a5fa",
  "in-progress": "#f59e0b",
  done: "#34d399",
};

export default function SignalCard({ report, isSelected, onClick, i }: SignalCardProps) {
  const sevColor = SEV_COLORS[report.severity] ?? "#888";
  const statColor = STATUS_COLORS[report.status] ?? "#888";

  const sevLabels: Record<string, string> = {
    critical: i.sevCritical,
    high: i.sevHigh,
    medium: i.sevMedium,
    low: i.sevLow,
  };
  const statLabels: Record<string, string> = {
    open: i.statusOpen,
    "in-progress": i.statusInProgress,
    done: i.statusDone,
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer
        group relative overflow-hidden
        ${isSelected
          ? "bg-pink-primary/10 border-pink-primary/40 shadow-[0_0_24px_rgba(255,77,148,0.15)]"
          : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
        }
      `}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        style={{ backgroundColor: sevColor }}
      />

      <div className="flex gap-4 pl-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl shrink-0">
          {report.img}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-[DM_Sans,sans-serif] text-[15px] font-bold text-white truncate leading-tight">
            {report.title}
          </h4>
          <p className="font-[DM_Sans,sans-serif] text-[12px] text-white/40 truncate mt-1">
            {report.location}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-2.5 mt-2.5">
            <span
              className="font-[DM_Sans,sans-serif] text-[10px] font-semibold tracking-wide px-3 py-[5px] rounded-full uppercase leading-none"
              style={{
                color: sevColor,
                backgroundColor: sevColor + "18",
                border: `1px solid ${sevColor}30`,
              }}
            >
              {sevLabels[report.severity] ?? report.severity}
            </span>
            <span
              className="font-[DM_Sans,sans-serif] text-[10px] font-semibold tracking-wide px-3 py-[5px] rounded-full uppercase leading-none"
              style={{
                color: statColor,
                backgroundColor: statColor + "18",
                border: `1px solid ${statColor}30`,
              }}
            >
              {statLabels[report.status] ?? report.status}
            </span>
            <span className="font-[DM_Sans,sans-serif] text-[10px] text-white/25 ml-auto">
              {report.time}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
