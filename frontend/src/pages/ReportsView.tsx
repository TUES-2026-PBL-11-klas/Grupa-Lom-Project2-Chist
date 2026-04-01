import { useState, useMemo } from "react";
import "../styles/ReportsView.css";
import { useApp } from "../context/AppContext.jsx";
import ReportCard from "../components/ReportCard.jsx";

const FILTERS = [
  { id: "all", label: "Всички" },
  { id: "open", label: "Отворени" },
  { id: "in-progress", label: "В процес" },
  { id: "done", label: "Завършени" },
  { id: "critical", label: "🚨 Критични" },
  { id: "high", label: "⚠️ Сериозни" },
];

interface ReportsViewProps {
  onNewReport: () => void;
}

export default function ReportsView({ onNewReport }: ReportsViewProps) {
  const { reports } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("all");
  const [expandedId, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter((r: any) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        (r.district || "").toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "all" ||
        r.status === activeFilter ||
        r.severity === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [reports, search, activeFilter]);

  const openCount = reports.filter((r: any) => r.status === "open").length;
  const criticalCount = reports.filter(
    (r: any) => r.severity === "critical" && r.status === "open",
  ).length;

  return (
    <div className="reports-view">
      <div className="reports-view__header">
        <div>
          <div className="label-caps">Активни сигнали</div>
          <div className="reports-view__header-meta">
            <span className="reports-view__header-meta--open">
              {openCount} отворени
            </span>
            {criticalCount > 0 && (
              <span className="reports-view__header-meta--critical">
                · 🚨 {criticalCount} критични
              </span>
            )}
          </div>
        </div>
        <button
          className="btn-primary reports-view__new-btn"
          onClick={onNewReport}
        >
          + НОВ
        </button>
      </div>

      <div className="reports-view__search-wrap">
        <input
          className="input-field reports-view__search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търси по район, описание, потребител…"
        />
        {search && (
          <button
            className="reports-view__search-clear"
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="reports-view__filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`reports-view__filter-pill ${
              activeFilter === f.id
                ? "reports-view__filter-pill--active"
                : "reports-view__filter-pill--inactive"
            }`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="reports-view__sort-bar">
        <span className="reports-view__count">
          <span>{filtered.length}</span> резултата
        </span>
        <span className="reports-view__sort-label">↓ по дата</span>
      </div>

      <div className="reports-view__list">
        {filtered.length === 0 ? (
          <div className="reports-view__empty">
            <div className="reports-view__empty-icon">
              {search ? "🔍" : "🌿"}
            </div>
            <div className="reports-view__empty-text">
              {search ? `Няма резултати за „${search}"` : "Няма сигнали"}
            </div>
            {search && (
              <button
                className="btn-ghost reports-view__empty-clear"
                onClick={() => setSearch("")}
              >
                Изчисти търсенето
              </button>
            )}
          </div>
        ) : (
          filtered.map((r: any) => (
            <ReportCard
              key={r.id}
              report={r}
              expanded={expandedId === r.id}
              onClick={() => setExpanded(expandedId === r.id ? null : r.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
