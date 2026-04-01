import type { T, Lang } from "../i18n.ts";
import { translateReport } from "../i18n.ts";
import "../styles/SignalCard.css";

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
  lang: Lang;
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

export default function SignalCard({ report, isSelected, onClick, i, lang }: SignalCardProps) {
  const sevColor = SEV_COLORS[report.severity] ?? "#888";
  const statColor = STATUS_COLORS[report.status] ?? "#888";
  const tr = translateReport(lang, report);

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
      className={`signal-card ${isSelected ? "signal-card--selected" : ""}`}
    >
      <div className="signal-card__accent" style={{ backgroundColor: sevColor }} />

      <div className="signal-card__body">
        <div className="signal-card__icon">{report.img}</div>

        <div className="signal-card__content">
          <h4 className="signal-card__title">{tr.title}</h4>
          <p className="signal-card__location">{tr.location}</p>

          <div className="signal-card__tags">
            <span
              className="signal-card__tag"
              style={{
                color: sevColor,
                backgroundColor: sevColor + "18",
                border: `1px solid ${sevColor}30`,
              }}
            >
              {sevLabels[report.severity] ?? report.severity}
            </span>
            <span
              className="signal-card__tag"
              style={{
                color: statColor,
                backgroundColor: statColor + "18",
                border: `1px solid ${statColor}30`,
              }}
            >
              {statLabels[report.status] ?? report.status}
            </span>
            <span className="signal-card__time">{report.time}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
