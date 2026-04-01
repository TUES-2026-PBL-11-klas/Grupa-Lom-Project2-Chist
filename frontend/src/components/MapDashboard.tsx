import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";
import MapContainer from "./MapContainer.tsx";
import { t } from "../i18n.ts";
import type { Lang } from "../i18n.ts";

export default function MapDashboard() {
  const { reports, claimReport, completeReport, selectedReportId, selectReport } = useApp();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("bg");

  const i = t(lang);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "bg" ? "en" : "bg"));
  }, []);

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
    <div className="h-screen w-screen overflow-hidden bg-bg-base">
      <Navbar lang={lang} onToggleLang={toggleLang} />

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
      />

      {/* Map area — offset by sidebar on desktop */}
      <main className="fixed top-16 bottom-0 right-0 left-0 md:left-[380px]">
        <MapContainer
          reports={filteredReports}
          selectedId={selectedReportId}
          onSelectReport={handleSelectReport}
          onClaim={claimReport}
          onComplete={completeReport}
          i={i}
        />
      </main>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-4 z-50 md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-pink-primary to-magenta shadow-[0_4px_24px_rgba(255,77,148,0.4)] flex items-center justify-center text-white text-xl border-none cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        aria-label="Отвори сигнали"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Ambient glow effects */}
      <div
        className="fixed top-16 right-0 w-[400px] h-[400px] pointer-events-none z-[1] opacity-30 md:left-[380px]"
        style={{
          background: "radial-gradient(circle at top right, rgba(192,38,211,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(circle at bottom left, rgba(255,77,148,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
