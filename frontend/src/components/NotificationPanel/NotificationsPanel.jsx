import { useState } from "react";
import "./NotificationsPanel.css";

const INITIAL = [
  {
    id: 1,
    type: "points",
    icon: "⭐",
    title: "+120 точки!",
    message: "Задачата 'Борисова градина' беше потвърдена.",
    time: "преди 5мин",
    read: false,
  },
  {
    id: 2,
    type: "badge",
    icon: "🏅",
    title: "Нова значка!",
    message: "Получи: 🔥 7-дневен стрийк",
    time: "преди 1ч",
    read: false,
  },
  {
    id: 3,
    type: "report",
    icon: "📍",
    title: "Нов сигнал в района ти",
    message: "Борисова градина — критично замърсяване.",
    time: "преди 2ч",
    read: true,
  },
  {
    id: 4,
    type: "confirm",
    icon: "✅",
    title: "Задачата ти беше потвърдена",
    message: "EcoHero99 потвърди: 'Студентски град'",
    time: "преди 1д",
    read: true,
  },
  {
    id: 5,
    type: "streak",
    icon: "🔥",
    title: "Не прекъсвай стрийка!",
    message: "Имаш 7 дни поред. Влез и продължи!",
    time: "преди 2д",
    read: true,
  },
  {
    id: 6,
    type: "points",
    icon: "⭐",
    title: "+80 точки!",
    message: "Задачата 'Люлин 5' беше потвърдена.",
    time: "преди 3д",
    read: true,
  },
];

const TYPE_COLORS = {
  points: { color: "var(--amber)", bg: "rgba(245,197,24,0.12)" },
  badge: { color: "var(--purple)", bg: "rgba(192,132,252,0.12)" },
  report: { color: "var(--blue-info)", bg: "rgba(96,165,250,0.12)" },
  confirm: { color: "var(--green-bright)", bg: "rgba(74,222,128,0.12)" },
  streak: { color: "#ff8c00", bg: "rgba(255,140,0,0.12)" },
};

export default function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState(INITIAL);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div
      className="notif-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="notif-panel">
        <div className="notif-panel__header">
          <div>
            <div className="notif-panel__title">ИЗВЕСТИЯ</div>
            {unread > 0 && (
              <div className="notif-panel__unread">{unread} непрочетени</div>
            )}
          </div>
          <div className="notif-panel__header-btns">
            {unread > 0 && (
              <button
                className="notif-panel__mark-all"
                onClick={() =>
                  setNotifs((n) => n.map((x) => ({ ...x, read: true })))
                }
              >
                ПРОЧЕТИ ВСИЧКИ
              </button>
            )}
            <button
              className="notif-panel__close"
              onClick={onClose}
              aria-label="Затвори"
            >
              ✕
            </button>
          </div>
        </div>

        <hr className="divider" />

        {notifs.length === 0 ? (
          <div className="notif-panel__empty">
            <div className="notif-panel__empty-icon">🔔</div>
            Няма известия
          </div>
        ) : (
          notifs.map((n, i) => {
            const c = TYPE_COLORS[n.type] || TYPE_COLORS.confirm;
            return (
              <div
                key={n.id}
                className={`notif-item ${
                  n.read ? "notif-item--read" : "notif-item--unread"
                } anim-fade-up`}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {!n.read && <div className="notif-item__unread-dot" />}
                <div
                  className="notif-item__icon-box"
                  style={{ background: c.bg, border: `1px solid ${c.color}33` }}
                >
                  {n.icon}
                </div>
                <div className="notif-item__body">
                  <div
                    className="notif-item__title"
                    style={{
                      color: n.read
                        ? "var(--text-secondary)"
                        : "var(--text-primary)",
                    }}
                  >
                    {n.title}
                  </div>
                  <div className="notif-item__message">{n.message}</div>
                  <div className="notif-item__time">{n.time}</div>
                </div>
                <button
                  className="notif-item__dismiss"
                  onClick={() =>
                    setNotifs((ns) => ns.filter((x) => x.id !== n.id))
                  }
                  aria-label="Изтрий"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
