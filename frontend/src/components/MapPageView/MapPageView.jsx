import { useState } from "react";
import "./MapPageView.css";
import { SEVERITY_META, STATUS_META } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";
import MapView from "../MapView.jsx";
import ReportCard from "../Reports/ReportCard.jsx";

export default function MapPageView({ onNewReport }) {
  const { reports } = useApp();
  const [sevFilter, setSevFilter] = useState(null);
  const [stFilter, setStFilter] = useState(null);

  const filtered = reports.filter((r) => {
    if (sevFilter && r.severity !== sevFilter) return false;
    if (stFilter && r.status !== stFilter) return false;
    return true;
  });

  return (
    <div className="map-page">
      <div className="label-caps">Интерактивна карта · Sofia</div>

      <MapView reports={filtered} height={340} showControls />

      <div className="map-page__filter-section">
        <div className="label-caps map-page__filter-label">Сериозност</div>
        <div className="map-page__filter-row">
          <button
            className="map-page__pill"
            style={{
              border: `1px solid ${
                !sevFilter ? "var(--green-bright)" : "rgba(74,222,128,0.18)"
              }`,
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
                className="map-page__pill"
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
                  className="map-page__pill-dot"
                  style={{ background: v.color }}
                />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="map-page__status-row">
        {Object.entries(STATUS_META).map(([k, v]) => {
          const active = stFilter === k;
          return (
            <button
              key={k}
              className="map-page__status-pill"
              style={{
                border: `1px solid ${
                  active ? v.color : "rgba(74,222,128,0.15)"
                }`,
                background: active ? v.bg : "transparent",
                color: active ? v.color : "var(--text-muted)",
                fontWeight: active ? 700 : 400,
              }}
              onClick={() => setStFilter(active ? null : k)}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="map-page__result-count">
        Намерени: <span>{filtered.length}</span> сигнала
      </div>

      <div className="map-page__list">
        {filtered.length === 0 ? (
          <div className="map-page__empty">
            <div className="map-page__empty-icon">🔍</div>Няма сигнали с тези
            филтри
          </div>
        ) : (
          filtered.map((r) => <ReportCard key={r.id} report={r} />)
        )}
      </div>

      <button
        className="btn-primary map-page__fab"
        onClick={onNewReport}
        title="Нов сигнал"
      >
        📍
      </button>
    </div>
  );
}
