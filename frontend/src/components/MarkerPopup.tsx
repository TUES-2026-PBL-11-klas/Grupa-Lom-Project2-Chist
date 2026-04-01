import type { T } from "../i18n.ts";

interface Report {
  id: number;
  title: string;
  location: string;
  description: string;
  severity: string;
  status: string;
  img: string;
  points: number;
  reporter: string;
  reporterAvatar: string;
  time: string;
  volunteers: number;
}

interface MarkerPopupProps {
  report: Report;
  onClaim: (id: number) => void;
  onComplete: (id: number) => void;
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

export default function MarkerPopup({ report, onClaim, onComplete, i }: MarkerPopupProps) {
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
    <div className="w-[320px] p-0 font-[DM_Sans,sans-serif]">
      {/* Pink top accent */}
      <div className="h-1.5 bg-gradient-to-r from-pink-primary via-magenta to-pink-light rounded-t-2xl" />

      <div className="p-5 bg-bg-base rounded-b-2xl border border-white/[0.08] border-t-0">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl shrink-0">
            {report.img}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white leading-tight">{report.title}</h3>
            <p className="text-[12px] text-white/40 mt-1">
              {report.location}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-white/60 leading-relaxed mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="text-[10px] font-semibold tracking-wide px-3 py-[5px] rounded-full uppercase leading-none"
            style={{
              color: sevColor,
              backgroundColor: sevColor + "18",
            }}
          >
            {sevLabels[report.severity] ?? report.severity}
          </span>
          <span
            className="text-[10px] font-semibold tracking-wide px-3 py-[5px] rounded-full uppercase leading-none"
            style={{
              color: statColor,
              backgroundColor: statColor + "18",
            }}
          >
            {statLabels[report.status] ?? report.status}
          </span>
          <span className="text-[11px] text-pink-primary font-bold ml-auto">
            +{report.points} pts
          </span>
        </div>

        {/* Reporter */}
        <div className="flex items-center gap-2.5 py-3 border-t border-white/[0.06] mb-4">
          <span className="text-lg">{report.reporterAvatar}</span>
          <span className="text-[12px] text-white/50">
            {report.reporter}
          </span>
          <span className="text-[11px] text-white/25 ml-auto">
            {report.time}
          </span>
        </div>

        {/* Actions */}
        {report.status === "open" && (
          <button
            onClick={() => onClaim(report.id)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-primary to-magenta text-white text-[13px] font-bold tracking-wide border-none cursor-pointer hover:opacity-90 transition-opacity shadow-[0_6px_24px_rgba(255,77,148,0.35)]"
          >
            {i.claimTask}
          </button>
        )}
        {report.status === "in-progress" && (
          <button
            onClick={() => onComplete(report.id)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[13px] font-bold tracking-wide border-none cursor-pointer hover:opacity-90 transition-opacity shadow-[0_6px_24px_rgba(52,211,153,0.3)]"
          >
            {i.completeTask}
          </button>
        )}
        {report.status === "done" && (
          <div className="w-full py-3 rounded-xl bg-white/[0.04] text-center text-[13px] text-white/30 tracking-wide">
            {i.completed}
          </div>
        )}
      </div>
    </div>
  );
}
