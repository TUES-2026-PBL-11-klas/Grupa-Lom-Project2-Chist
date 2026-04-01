import { useState } from "react";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";
import MapDashboard from "./components/MapDashboard.tsx";
import ReportsView from "./pages/ReportsView.jsx";
import LeaderboardView from "./pages/LeaderboardView.jsx";
import ProfileView from "./pages/ProfileView.jsx";
import RewardsView from "./pages/RewardsView.jsx";
import ReportModal from "./components/ReportModal.jsx";
import NotificationsPanel from "./components/NotificationsPanel.jsx";

function Page({ children, k }) {
  return (
    <div key={k} className="anim-fade-up">
      {children}
    </div>
  );
}

export default function Main() {
  const [tab, setTab] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const isHome = tab === "home";

  const renderPage = () => {
    switch (tab) {
      case "home":
        return <MapDashboard />;
      case "reports":
        return (
          <Page k="rp">
            <ReportsView onNewReport={() => setShowModal(true)} />
          </Page>
        );
      case "board":
        return (
          <Page k="lb">
            <LeaderboardView />
          </Page>
        );
      case "rewards":
        return (
          <Page k="rw">
            <RewardsView />
          </Page>
        );
      case "profile":
        return (
          <Page k="pf">
            <ProfileView />
          </Page>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        position: "relative",
      }}
    >
      {!isHome && (
        <>
          <div className="ambient-orb-tl" aria-hidden="true" />
          <div className="ambient-orb-br" aria-hidden="true" />
        </>
      )}

      {/* Hide old header on home — Navbar is built into MapDashboard */}
      {!isHome && (
        <Header onNotifications={() => setShowNotifs(true)} />
      )}

      {isHome ? (
        renderPage()
      ) : (
        <main className="page-content">{renderPage()}</main>
      )}

      <Toast />
      {!isHome && <BottomNav active={tab} onChange={setTab} />}

      {!isHome && (
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          aria-label="Нов сигнал"
          style={{
            position: "fixed",
            bottom: "calc(var(--nav-h) + 14px)",
            right: 18,
            width: 50,
            height: 50,
            borderRadius: "50%",
            fontSize: 20,
            padding: 0,
            boxShadow: "0 0 24px var(--primary-glow)",
            zIndex: 50,
          }}
        >
          📍
        </button>
      )}

      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
      {showNotifs && (
        <NotificationsPanel onClose={() => setShowNotifs(false)} />
      )}
    </div>
  );
}
