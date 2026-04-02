import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";
import MapContainer from "./MapContainer.tsx";
import { t } from "../i18n.ts";
import type { Lang } from "../i18n.ts";
import "../styles/MapDashboard.css";

interface MapDashboardProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
  lang: Lang;
  onToggleLang: () => void;
}

export default function MapDashboard({ onNavigate, currentTab, lang, onToggleLang }: MapDashboardProps) {
  const { reports, claimReport, completeReport, selectedReportId, selectReport } = useApp();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const i = t(lang);

  /* Filter reports by active filter + search query */
  const filteredReports = useMemo(() => {
    let filtered = reports;

    switch (activeFilter) {
      case "critical":
        filtered = filtered.filter((r: any) => r.severity === "critical");
        break;
      case "high":
        filtered = filtered.filter((r: any) => r.severity === "high");
        break;
      case "open":
        filtered = filtered.filter((r: any) => r.status === "open");
        break;
      case "done":
        filtered = filtered.filter((r: any) => r.status === "done");
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r: any) =>
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.district?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [reports, activeFilter, searchQuery]);

  const handleSelectReport = useCallback(
    (id: number) => {
      selectReport(id);
      setMobileOpen(false);
    },
    [selectReport]
  );

  return (
    <div className="map-dashboard">
      <Navbar lang={lang} onToggleLang={onToggleLang} currentTab={currentTab} onNavigate={onNavigate} />

      <Sidebar
        reports={filteredReports}
        allReports={reports}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedId={selectedReportId}
        onSelectReport={handleSelectReport}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        i={i}
        lang={lang}
      />

      <main className="map-dashboard__main">
        <MapContainer
          reports={filteredReports}
          selectedId={selectedReportId}
          onSelectReport={handleSelectReport}
          onClaim={claimReport}
          onComplete={completeReport}
          i={i}
          lang={lang}
        />
      </main>

      <button
        onClick={() => setMobileOpen(true)}
        className="map-dashboard__mobile-toggle"
        aria-label="Отвори сигнали"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="map-dashboard__glow-tr" />
      <div className="map-dashboard__glow-bl" />
    </div>
  );
}
