import { useState } from "react";
import "./ProfileView.css";
import { BADGES, LEVEL_THRESHOLDS } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";

const WEEK_DATA = [
  [2, 5, 1, 3, 6, 4, 2],
  [4, 3, 7, 2, 5, 8, 3],
  [1, 6, 3, 5, 2, 4, 7],
  [5, 3, 6, 4, 7, 2, 5],
];
const DAYS = ["П", "В", "С", "Ч", "П", "С", "Н"];
const CHART_MAX = Math.max(...WEEK_DATA.flat());

function Toggle({ label, desc, value, onToggle }) {
  return (
    <div className="profile__toggle-row">
      <div>
        <div className="profile__toggle-label">{label}</div>
        <div className="profile__toggle-desc">{desc}</div>
      </div>
      <button
        className={`profile__toggle-btn ${
          value ? "profile__toggle-btn--on" : "profile__toggle-btn--off"
        }`}
        onClick={onToggle}
        aria-pressed={value}
      >
        <div
          className={`profile__toggle-knob ${
            value ? "profile__toggle-knob--on" : "profile__toggle-knob--off"
          }`}
        />
      </button>
    </div>
  );
}

const TABS = [
  { id: "stats", label: "Статистики" },
  { id: "badges", label: "Значки" },
  { id: "activity", label: "Активност" },
  { id: "settings", label: "Настройки" },
];

export default function ProfileView() {
  const { user } = useApp();
  const [activeTab, setTab] = useState("stats");
  const [notifs, setNotifs] = useState(true);
  const [gps, setGps] = useState(true);
  const [dark, setDark] = useState(true);
  const [emails, setEmails] = useState(false);

  const currentLevel = LEVEL_THRESHOLDS.find(
    (l) => user.points >= l.min && user.points <= l.max,
  );
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > user.points);
  const xpPct = nextLevel
    ? Math.min((user.points / nextLevel.min) * 100, 100)
    : 100;

  const statBars = [
    {
      icon: "⭐",
      key: "Общо точки",
      val: user.points.toLocaleString(),
      color: "var(--amber)",
      pct: user.points / 5000,
    },
    {
      icon: "🧹",
      key: "Почиствания",
      val: user.cleanings,
      color: "var(--green-bright)",
      pct: user.cleanings / 50,
    },
    {
      icon: "📍",
      key: "Подадени сигнали",
      val: user.reports,
      color: "var(--blue-info)",
      pct: user.reports / 30,
    },
    {
      icon: "🔥",
      key: "Стрийк рекорд",
      val: `${user.streak} дни`,
      color: "#ff8c00",
      pct: user.streak / 30,
    },
  ];

  return (
    <div className="profile">
      <div className="card profile__hero">
        <div className="profile__hero-glow" />
        <div className="profile__top">
          <div className="profile__avatar">{user.avatar}</div>
          <div>
            <div className="profile__name">
              {user.name}
              {user.verified && (
                <span className="profile__verified">✓ VERIFIED</span>
              )}
            </div>
            <div className="profile__level">
              {currentLevel?.icon} {currentLevel?.level}
            </div>
            <div className="profile__meta">
              {user.streak > 0 && <span>🔥 {user.streak} дни стрийк</span>}
              <span>📅 {user.joined}</span>
            </div>
          </div>
        </div>

        <div className="profile__xp">
          <div className="profile__xp-header">
            <span className="profile__xp-label">
              КЪМ {nextLevel?.level || "MAX"}
            </span>
            <span className="profile__xp-val">
              {user.points.toLocaleString()} /{" "}
              {nextLevel?.min?.toLocaleString() || "∞"}
            </span>
          </div>
          <div className="profile__xp-track">
            <div className="profile__xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        <div className="profile__stats">
          {[
            {
              icon: "⭐",
              val: user.points.toLocaleString(),
              label: "ТОЧКИ",
              color: "var(--amber)",
            },
            {
              icon: "🧹",
              val: user.cleanings,
              label: "ПОЧИСТВАНИЯ",
              color: "var(--green-bright)",
            },
            {
              icon: "📍",
              val: user.reports,
              label: "СИГНАЛИ",
              color: "var(--blue-info)",
            },
          ].map((s) => (
            <div key={s.label} className="profile__stat">
              <div className="profile__stat-icon">{s.icon}</div>
              <div className="profile__stat-val" style={{ color: s.color }}>
                {s.val}
              </div>
              <div className="profile__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`profile__tab ${
              activeTab === t.id
                ? "profile__tab--active"
                : "profile__tab--inactive"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "stats" && (
        <div className="profile__stat-bars anim-fade-up">
          {statBars.map((s) => (
            <div key={s.key} className="card profile__stat-bar-card">
              <div className="profile__stat-bar-header">
                <span className="profile__stat-bar-key">
                  {s.icon} {s.key}
                </span>
                <span
                  className="profile__stat-bar-val"
                  style={{ color: s.color }}
                >
                  {s.val}
                </span>
              </div>
              <div className="profile__stat-bar-track">
                <div
                  className="profile__stat-bar-fill"
                  style={{
                    width: `${Math.min(s.pct * 100, 100)}%`,
                    background: `linear-gradient(90deg,${s.color},${s.color}aa)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "badges" && (
        <div className="anim-fade-up">
          <div className="profile__badge-intro">
            {BADGES.filter((b) => b.earned).length} / {BADGES.length} отключени
          </div>
          <div className="profile__badge-grid">
            {BADGES.map((b) => (
              <div
                key={b.id}
                title={b.desc}
                className={`profile__badge-item ${
                  b.earned
                    ? "profile__badge-item--earned"
                    : "profile__badge-item--locked"
                }`}
              >
                <div className="profile__badge-icon">{b.icon}</div>
                <div
                  className="profile__badge-name"
                  style={{ color: b.earned ? "var(--text-primary)" : "#666" }}
                >
                  {b.name}
                </div>
                {b.earned && <div className="profile__badge-earned-dot" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="card profile__activity-card anim-fade-up">
          <div className="label-caps profile__chart-label">
            Активност последни 4 седмици
          </div>
          <div className="profile__chart">
            {WEEK_DATA.map((week, wi) => (
              <div key={wi} className="profile__chart-week">
                {week.map((val, di) => (
                  <div key={di} className="profile__chart-bar-wrap">
                    <div
                      className="profile__chart-bar"
                      style={{
                        height: Math.max(4, (val / CHART_MAX) * 44),
                        background: `rgba(74,222,128,${
                          val > 0 ? 0.2 + (val / CHART_MAX) * 0.7 : 0.06
                        })`,
                        border: `1px solid rgba(74,222,128,${
                          val > 0 ? 0.3 : 0.1
                        })`,
                      }}
                    />
                    {wi === 3 && (
                      <span className="profile__chart-day">{DAYS[di]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="anim-fade-up">
          <div className="card profile__settings-card">
            <Toggle
              label="Push известия"
              desc="Нови сигнали в твоя район"
              value={notifs}
              onToggle={() => setNotifs((v) => !v)}
            />
            <Toggle
              label="GPS локация"
              desc="Автоматично запазване"
              value={gps}
              onToggle={() => setGps((v) => !v)}
            />
            <Toggle
              label="Тъмен режим"
              desc="Eco тема (препоръчано)"
              value={dark}
              onToggle={() => setDark((v) => !v)}
            />
            <Toggle
              label="Email известия"
              desc="Седмичен дайджест"
              value={emails}
              onToggle={() => setEmails((v) => !v)}
            />
          </div>
          <button className="btn-danger profile__logout">
            ИЗХОД ОТ ПРОФИЛА
          </button>
        </div>
      )}
    </div>
  );
}
