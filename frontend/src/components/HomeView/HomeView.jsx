import { useEffect, useState } from "react";
import "./HomeView.css";
import { STATS_GLOBAL } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";
import MapView from "../MapView.jsx";
import ReportCard from "../Reports/ReportCard.jsx";

function useCounter(target, duration = 1800, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return val;
}

function StatCard({ icon, label, value, color, delay }) {
  const animated = useCounter(value, 1800, delay);
  return (
    <div
      className="card home-stat-card anim-fade-up"
      style={{ borderColor: `${color}22`, animationDelay: `${delay}ms` }}
    >
      <div className="home-stat-card__icon">{icon}</div>
      <div className="home-stat-card__value" style={{ color }}>
        {animated.toLocaleString()}
      </div>
      <div className="home-stat-card__label" style={{ color: `${color}66` }}>
        {label}
      </div>
    </div>
  );
}

const FEED_COLORS = {
  clean: "#4ade80",
  report: "#60a5fa",
  confirm: "#f5c518",
  badge: "#c084fc",
};

export default function HomeView({ onNewReport, onNavigate }) {
  const { reports, activityFeed } = useApp();
  const urgent = reports
    .filter(
      (r) =>
        r.status === "open" &&
        (r.severity === "critical" || r.severity === "high"),
    )
    .slice(0, 2);

  return (
    <div className="home-view">
      <div className="home-stats">
        <StatCard
          icon="🧹"
          label="Почистени"
          value={STATS_GLOBAL.totalCleaned}
          color="#4ade80"
          delay={0}
        />
        <StatCard
          icon="🏃"
          label="Активни"
          value={STATS_GLOBAL.activeVolunteers}
          color="#60a5fa"
          delay={100}
        />
        <StatCard
          icon="⭐"
          label="Точки"
          value={STATS_GLOBAL.pointsAwarded}
          color="#f5c518"
          delay={200}
        />
      </div>

      <div className="home-impact">
        {[
          { icon: "♻️", val: "3.8т", label: "Отпадъци" },
          { icon: "🌍", val: "94кг", label: "CO₂ спасен" },
          { icon: "🏘️", val: "14", label: "Района" },
        ].map((s) => (
          <div key={s.label} className="home-impact__item">
            <div className="home-impact__icon">{s.icon}</div>
            <div className="home-impact__val">{s.val}</div>
            <div className="home-impact__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="home-map-label">
          <span className="label-caps">Карта на сигналите</span>
          <span className="home-map-label__live">◉ LIVE</span>
        </div>
        <MapView reports={reports} height={240} />
      </div>

      <button className="btn-primary home-cta" onClick={onNewReport}>
        📍 ДОКЛАДВАЙ ЗАМЪРСЯВАНЕ
      </button>

      {urgent.length > 0 && (
        <div>
          <div className="label-caps" style={{ marginBottom: 10 }}>
            🚨 Спешни сигнали
          </div>
          <div className="home-urgent">
            {urgent.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onClick={() => onNavigate("reports")}
              />
            ))}
          </div>
          <button
            className="btn-ghost"
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px 0",
              fontSize: 11,
              letterSpacing: 1,
            }}
            onClick={() => onNavigate("reports")}
          >
            ВИЖДАЙ ВСИЧКИ СИГНАЛИ →
          </button>
        </div>
      )}

      <div>
        <div className="label-caps" style={{ marginBottom: 10 }}>
          ◉ Live Активност
        </div>
        <div className="home-feed stagger">
          {activityFeed.slice(0, 6).map((item) => {
            const color = FEED_COLORS[item.type] || "#4ade80";
            return (
              <div key={item.id} className="home-feed__item anim-fade-up">
                <div className="home-feed__left">
                  <span style={{ fontSize: 18 }}>{item.userAvatar}</span>
                  <div className="home-feed__text">
                    <span className="home-feed__user" style={{ color }}>
                      {item.user}
                    </span>
                    <span className="home-feed__verb"> {item.action} </span>
                    <span className="home-feed__place">{item.place}</span>
                  </div>
                </div>
                <div className="home-feed__right">
                  <span className="home-feed__pts">{item.pts}</span>
                  <span className="home-feed__time">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
