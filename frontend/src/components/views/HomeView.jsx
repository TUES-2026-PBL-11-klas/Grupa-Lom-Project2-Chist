import { useState } from "react";
import "./HomeView.css";
import { SEVERITY_META, STATUS_META } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";
import MapView from "./MapView.jsx";

export default function HomeView({ onNewReport, onNavigate }) {
  const { reports } = useApp();
  const [sevFilter, setSevFilter] = useState(null);
  const [stFilter, setStFilter] = useState(null);

  const filtered = reports.filter((r) => {
    if (sevFilter && r.severity !== sevFilter) return false;
    if (stFilter && r.status !== stFilter) return false;
    return true;
  });

  const openCount = reports.filter((r) => r.status === "open").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "in-progress",
  ).length;
  const doneCount = reports.filter((r) => r.status === "done").length;

  return (
    <div className="home-map-page">
      <MapView reports={filtered} height="100%" showControls />

      {/* Top Control Bar */}
      <div className="home-top-bar">
        <button className="home-report-btn" onClick={onNewReport}>
          📍 ДОКЛАДВАЙ ПРОБЛЕМ
        </button>
        <button className="home-info-btn" onClick={() => onNavigate("reports")}>
          🔍 ПРЕГЛЕД
        </button>
      </div>

      {/* Filter Section */}
      <div className="home-filter-section">
        <div className="home-filter-label">СЕРИОЗНОСТ</div>
        <div className="home-filter-row">
          <button
            className="home-filter-pill"
            style={{
              border: !sevFilter
                ? "1px solid var(--green-bright)"
                : "1px solid rgba(74,222,128,0.18)",
              background: !sevFilter ? "rgba(74,222,128,0.14)" : "transparent",
              color: !sevFilter ? "var(--green-bright)" : "var(--text-muted)",
              fontWeight: !sevFilter ? 700 : 400,
            }}
            onClick={() => setSevFilter(null)}
          >
            Всички
          </button>
          {Object.entries(SEVERITY_META).map(([k, v]) => {
            const active = sevFilter === k;
            return (
              <button
                key={k}
                className="home-filter-pill"
                style={
                  active
                    ? {
                        border: `1px solid ${v.color}`,
                        background: v.bg,
                        color: v.color,
                        fontWeight: 700,
                      }
                    : {
                        border: "1px solid rgba(74,222,128,0.18)",
                        background: "transparent",
                        color: "var(--text-muted)",
                      }
                }
                onClick={() => setSevFilter(active ? null : k)}
              >
                <span
                  className="home-filter-dot"
                  style={{ background: v.color }}
                />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="home-status-row">
        {Object.entries(STATUS_META).map(([k, v]) => {
          const active = stFilter === k;
          return (
            <button
              key={k}
              className="home-status-pill"
              style={
                active
                  ? {
                      border: `1px solid ${v.color}`,
                      background: v.bg,
                      color: v.color,
                      fontWeight: 700,
                    }
                  : {
                      border: "1px solid rgba(74,222,128,0.18)",
                      background: "transparent",
                      color: "var(--text-muted)",
                    }
              }
              onClick={() => setStFilter(active ? null : k)}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="home-stats-row">
        <div className="home-stat-pill">
          <div className="home-stat-pill__val" style={{ color: "var(--red)" }}>
            {openCount}
          </div>
          <div className="home-stat-pill__key">ОТВОРЕНИ</div>
        </div>
        <div className="home-stat-pill">
          <div
            className="home-stat-pill__val"
            style={{ color: "var(--primary)" }}
          >
            {inProgressCount}
          </div>
          <div className="home-stat-pill__key">В ПРОЦЕС</div>
        </div>
        <div className="home-stat-pill">
          <div
            className="home-stat-pill__val"
            style={{ color: "var(--green-bright)" }}
          >
            {doneCount}
          </div>
          <div className="home-stat-pill__key">ЗАВЪРШЕНИ</div>
        </div>
      </div>
    </div>
  );
}
