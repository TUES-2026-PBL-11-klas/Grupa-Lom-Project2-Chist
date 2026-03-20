import { useState } from "react";
import "./HomeView.css";
import { SEVERITY_META, STATS_GLOBAL } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";
import MapView from "../MapView/MapView.jsx";

const FILTERS = [
  { id: "all", label: "Всички", color: null },
  { id: "critical", label: "🚨 Критични", color: "#f43f5e" },
  { id: "high", label: "⚠️ Сериозни", color: "#fb923c" },
  { id: "open", label: "Отворени", color: null },
  { id: "done", label: "✅ Завършени", color: null },
];

export default function HomeView({ onNewReport, onNavigate }) {
  const { reports } = useApp();
  const [activeFilter, setFilter] = useState("all");

  const filtered = reports.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "critical") return r.severity === "critical";
    if (activeFilter === "high") return r.severity === "high";
    if (activeFilter === "open") return r.status === "open";
    if (activeFilter === "done") return r.status === "done";
    return true;
  });

  const openCount = reports.filter((r) => r.status === "open").length;
  const critCount = reports.filter(
    (r) => r.severity === "critical" && r.status === "open",
  ).length;
  const doneCount = reports.filter((r) => r.status === "done").length;

  return (
    <div className="home-map-page">
      <MapView reports={filtered} height="100%" showControls />

      {/* Search + Report button */}
      <div className="home-top-bar">
        <button
          className="home-search-pill"
          onClick={() => onNavigate("reports")}
        >
          <span className="home-search-pill__icon">🔍</span>
          <span className="home-search-pill__text">Търси сигнали…</span>
        </button>
        <button className="home-report-btn" onClick={onNewReport}>
          📍 ДОКЛАДВАЙ
        </button>
      </div>

      {/* Filter chips */}
      <div className="home-filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`home-filter-chip ${
              activeFilter === f.id
                ? "home-filter-chip--active"
                : "home-filter-chip--inactive"
            }`}
            style={
              activeFilter === f.id && f.color
                ? { background: f.color, boxShadow: `0 0 12px ${f.color}66` }
                : {}
            }
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats bar at bottom */}
      <div className="home-bottom-bar">
        <div className="home-stat-pill">
          <div className="home-stat-pill__val" style={{ color: "var(--red)" }}>
            {critCount}
          </div>
          <div className="home-stat-pill__key">КРИТИЧНИ</div>
        </div>
        <div className="home-stat-pill">
          <div
            className="home-stat-pill__val"
            style={{ color: "var(--primary)" }}
          >
            {openCount}
          </div>
          <div className="home-stat-pill__key">ОТВОРЕНИ</div>
        </div>
        <div className="home-stat-pill">
          <div
            className="home-stat-pill__val"
            style={{ color: "var(--green-ok)" }}
          >
            {doneCount}
          </div>
          <div className="home-stat-pill__key">ЗАВЪРШЕНИ</div>
        </div>
        <div className="home-stat-pill">
          <div
            className="home-stat-pill__val"
            style={{ color: "var(--secondary)" }}
          >
            {STATS_GLOBAL.totalCleaned.toLocaleString()}
          </div>
          <div className="home-stat-pill__key">ОБЩО</div>
        </div>
      </div>
    </div>
  );
}
