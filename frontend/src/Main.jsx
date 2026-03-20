import { useState } from "react";
import Header from "./Header/Header.jsx";
import BottomNav from "./components/BottomNav/BottomNav.jsx";
import Toast from "./components/Toast/Toast.jsx";
import HomeView from "./components/HomeView/HomeView.jsx";
import MapPageView from "./components/MapPageView/MapPageView.jsx";
import ReportsView from "./components/ReportViews/ReportsView.jsx";
import LeaderboardView from "./components/LeaderboardView.jsx";
import ProfileView from "./components/ProfileView/ProfileView.jsx";
import RewardsView from "./components/ReportViews/RewardsView.jsx";
import ReportModal from "./components/Reports/ReportModal.jsx";
import NotificationsPanel from "./components/NotificationPanel/NotificationsPanel.jsx";

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

  const renderPage = () => {
    switch (tab) {
      case "home":
        return (
          <Page k="home">
            <HomeView
              onNewReport={() => setShowModal(true)}
              onNavigate={setTab}
            />
          </Page>
        );
      case "map":
        return (
          <Page k="map">
            <MapPageView onNewReport={() => setShowModal(true)} />
          </Page>
        );
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
        background: "var(--bg-void)",
        position: "relative",
      }}
    >
      <div className="ambient-orb-tl" aria-hidden="true" />
      <div className="ambient-orb-br" aria-hidden="true" />

      <Header onNotifications={() => setShowNotifs(true)} />

      <main className="page-content" aria-label="Основно съдържание">
        {renderPage()}
      </main>

      <Toast />
      <BottomNav active={tab} onChange={setTab} />

      {tab !== "home" && (
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          aria-label="Нов сигнал"
          style={{
            position: "fixed",
            bottom: "calc(var(--nav-height) + 14px)",
            right: 18,
            width: 52,
            height: 52,
            borderRadius: "50%",
            fontSize: 22,
            padding: 0,
            boxShadow: "0 0 24px rgba(74,222,128,0.5)",
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
