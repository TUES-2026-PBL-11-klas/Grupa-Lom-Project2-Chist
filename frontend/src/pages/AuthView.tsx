import { useState } from "react";
import { authApi } from "../services/api.ts";
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
          style={{ borderColor: focused ? "var(--pink-primary)" : undefined }}
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

  const submit = async () => {
    if (!email || !password) {
      setError("Попълни всички полета.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Dev shortcut — remove before production
      if (email === "test@chist.bg" && password === "test1234") {
        localStorage.setItem("cw_token", "dev-test-token");
        onSuccess();
        return;
      }
      const res = await authApi.login(email, password);
      localStorage.setItem("cw_token", res.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Грешен имейл или парола.");
    } finally {
      setLoading(false);
    }
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

  const submit = async () => {
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
    try {
      const res = await authApi.register({ email, username, password });
      localStorage.setItem("cw_token", res.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Грешка при регистрация.");
    } finally {
      setLoading(false);
    }
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

      </div>

      <div className="auth__footer">
        © 2025 CHIST · GROUP LOM · SOFIA, BG
      </div>
    </div>
  );
}