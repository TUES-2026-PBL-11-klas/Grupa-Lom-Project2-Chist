import "../styles/Header.css";
import { useApp } from "../context/AppContext.jsx";

export default function Header({ onNotifications }) {
  const { user } = useApp();
  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-icon">🌿</div>
        <div>
          <div className="header__logo-wordmark">CHIST</div>
          <div className="header__logo-sub">SOFIA · BETA</div>
        </div>
      </div>
      <div className="header__right">
        <div className="header__user-pts">
          <div className="header__user-pts-val">
            ⭐ {user.points.toLocaleString()}
          </div>
          {user.streak > 0 && (
            <div className="header__user-pts-streak">🔥 {user.streak} дни</div>
          )}
        </div>
        <button
          className="header__bell"
          aria-label="Известия"
          onClick={onNotifications}
        >
          🔔
          <span className="header__bell-dot" aria-hidden="true" />
        </button>
        <button className="header__avatar" aria-label="Профил">
          {user.avatar}
        </button>
      </div>
    </header>
  );
}
