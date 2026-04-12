import { useState } from "react";
import "../styles/AuthView.css";

function Field({ label, type = "text", value, onChange, placeholder, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="auth__field">
      <label className="label-caps auth__field-label">{label}</label>
      <div className="auth__field-wrap">
        {icon && <span className="auth__field-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${icon ? "auth__field-input" : ""}`}
          style={{ borderColor: focused ? "var(--primary)" : undefined }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function LoginForm({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!email || !password) {
      setError("Попълни всички полета.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 900);
  };

  const handleKey = (e) => e.key === "Enter" && submit();

  return (
    <>
      <Field
        label="Имейл"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon="📧"
        onKeyDown={handleKey}
      />
      <Field
        label="Парола"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon="🔒"
        type="password"
      />
      {error && <div className="error-box">{error}</div>}
      <button
        className="btn-primary auth__submit"
        onClick={submit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner">⟳</span> Влизане…
          </>
        ) : (
          "ВЛЕЗ В ПРОФИЛА"
        )}
      </button>
      <p className="auth__switch">
        <button className="auth__switch-btn" onClick={onSwitch}>
          Нямаш профил? РЕГИСТРИРАЙ СЕ →
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSuccess, onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!username || !email || !password) {
      setError("Попълни всички полета.");
      return;
    }
    if (password !== confirm) {
      setError("Паролите не съвпадат.");
      return;
    }
    if (password.length < 8) {
      setError("Парола — мин. 8 символа.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1100);
  };

  return (
    <>
      <Field
        label="Потребителско име"
        value={username}
        onChange={setUsername}
        placeholder="GreenWarrior99"
        icon="🌿"
      />
      <Field
        label="Имейл"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon="📧"
      />
      <Field
        label="Парола"
        value={password}
        onChange={setPassword}
        placeholder="мин. 8 символа"
        icon="🔒"
        type="password"
      />
      <Field
        label="Потвърди парола"
        value={confirm}
        onChange={setConfirm}
        placeholder="••••••••"
        icon="🔒"
        type="password"
      />
      {error && <div className="error-box">{error}</div>}
      <button
        className="btn-primary auth__submit"
        onClick={submit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner">⟳</span> Регистриране…
          </>
        ) : (
          "СЪЗДАЙ ПРОФИЛ"
        )}
      </button>
      <p className="auth__switch">
        <button className="auth__switch-btn" onClick={onSwitch}>
          ← ВЕЧЕ ИМАМ ПРОФИЛ
        </button>
      </p>
    </>
  );
}

export default function AuthView({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth">
      <div className="auth__orb-top" aria-hidden="true" />
      <div className="auth__orb-br" aria-hidden="true" />

      <div className="auth__card">
        <div className="auth__logo">
          <div className="auth__logo-icon anim-float">🌿</div>
          <div className="auth__logo-wordmark">CHIST</div>
          <div className="auth__logo-sub">SOFIA · ПО-ЧИСТ ГРАД</div>
        </div>

        <div className="auth__tabs">
          {[
            { id: "login", label: "ВХОД" },
            { id: "register", label: "РЕГИСТРАЦИЯ" },
          ].map((t) => (
            <button
              key={t.id}
              className={`auth__tab ${
                mode === t.id ? "auth__tab--active" : "auth__tab--inactive"
              }`}
              onClick={() => setMode(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <LoginForm
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("login")}
          />
        )}

        <div className="auth__features">
          {[
            "📍 Докладвай замърсявания",
            "🧹 Почиствай и печели",
            "🏆 Класирай се & Спечели награди",
          ].map((f) => (
            <div key={f} className="auth__feature-item">
              {f}
            </div>
          ))}
        </div>

        <div className="auth__guest-wrap">
          <button className="auth__guest-btn" onClick={onAuthenticated}>
            Продължи като гост →
          </button>
        </div>
      </div>

      <div className="auth__footer">
        © 2025 CHIST · GROUP LOM · SOFIA, BG
      </div>
    </div>
  );
}