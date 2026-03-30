import "../styles/ReportCard.css";
import { SEVERITY_META, STATUS_META } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function ReportCard({ report, expanded = false, onClick }) {
  const { claimReport, completeReport, user } = useApp();
  const meta = SEVERITY_META[report.severity];
  const sMeta = STATUS_META[report.status];
  const isOwn = report.claimedBy === user.name;

  return (
    <article
      className={`card report-card ${onClick ? "report-card--clickable" : ""}`}
      style={{ borderColor: `${meta.color}33` }}
      onClick={onClick}
    >
      <div
        className="report-card__strip"
        style={{
          background: `linear-gradient(180deg,${meta.color},${meta.color}44)`,
        }}
      />
      {report.aiVerified && (
        <div className="report-card__ai-badge">🤖 AI ✓</div>
      )}

      <div className="report-card__top">
        <div
          className="report-card__icon-box"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          {report.img}
        </div>
        <div className="report-card__info">
          <div
            className="report-card__title"
            style={{ paddingRight: report.aiVerified ? 68 : 0 }}
          >
            {report.title}
          </div>
          <div className="report-card__loc">
            <span>📍</span>
            <span>{report.location}</span>
          </div>
        </div>
      </div>

      {expanded && report.description && (
        <p className="report-card__desc">{report.description}</p>
      )}

      <div className="report-card__bottom">
        <div className="report-card__tags">
          <div className="report-card__status">
            <div
              className="report-card__status-dot"
              style={{
                background: sMeta.color,
                boxShadow: `0 0 6px ${sMeta.color}`,
              }}
            />
            <span
              className="report-card__status-label"
              style={{ color: sMeta.color }}
            >
              {sMeta.label}
            </span>
          </div>
          <span
            className="tag"
            style={{
              background: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
            }}
          >
            {meta.label}
          </span>
          <span className="report-card__time">· {report.time}</span>
        </div>
        <div className="report-card__actions">
          <span className="report-card__pts">+{report.points}</span>
          {report.status === "open" && (
            <button
              className="btn-primary report-card__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                claimReport(report.id);
              }}
            >
              🧹 ПОЕМИ
            </button>
          )}
          {report.status === "in-progress" && isOwn && (
            <button
              className="btn-primary report-card__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                completeReport(report.id);
              }}
            >
              ✅ ЗАВЪРШИ
            </button>
          )}
          {report.status === "done" && (
            <span className="report-card__done-label">✅ Завършено</span>
          )}
        </div>
      </div>

      <div className="report-card__footer">
        <span>{report.reporterAvatar}</span>
        <span>{report.reporter}</span>
        {report.district && (
          <>
            <span className="report-card__footer-sep">·</span>
            <span>{report.district}</span>
          </>
        )}
        {report.volunteers > 0 && (
          <>
            <span className="report-card__footer-sep">·</span>
            <span>👥 {report.volunteers}</span>
          </>
        )}
      </div>
    </article>
  );
}
