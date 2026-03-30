import "../styles/BottomNav.css";

const TABS = [
  { id: "home", icon: "🏠", label: "Начало" },
  { id: "reports", icon: "📍", label: "Сигнали" },
  { id: "board", icon: "🏆", label: "Класация" },
  { id: "rewards", icon: "🎁", label: "Награди" },
  { id: "profile", icon: "👤", label: "Профил" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Главна навигация">
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            className="bottom-nav__btn"
            onClick={() => onChange(t.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`bottom-nav__icon ${
                isActive
                  ? "bottom-nav__icon--active"
                  : "bottom-nav__icon--inactive"
              }`}
            >
              {t.icon}
            </span>
            <span
              className={`bottom-nav__label ${
                isActive
                  ? "bottom-nav__label--active"
                  : "bottom-nav__label--inactive"
              }`}
            >
              {t.label.toUpperCase()}
            </span>
            <span
              className={`bottom-nav__dot ${
                isActive
                  ? "bottom-nav__dot--visible"
                  : "bottom-nav__dot--hidden"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
