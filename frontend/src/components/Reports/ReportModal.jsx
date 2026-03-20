import { useState, useRef } from "react";
import "./ReportModal.css";
import { SEVERITY_META } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";

function StepBar({ current, total }) {
  return (
    <div className="step-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`step-bar__segment ${
            i < current
              ? "step-bar__segment--done"
              : "step-bar__segment--pending"
          }`}
        />
      ))}
    </div>
  );
}

function Step1({ data, onChange, onNext }) {
  const ok =
    data.description.trim().length > 5 && data.location.trim().length > 2;
  return (
    <div className="anim-fade-up">
      <label
        className="label-caps"
        style={{ marginBottom: 8, display: "block" }}
      >
        Местоположение
      </label>
      <input
        className="input-field"
        value={data.location}
        onChange={(e) => onChange({ location: e.target.value })}
        placeholder="напр. Борисова градина, вход 3…"
        style={{ marginBottom: 16 }}
      />
      <label
        className="label-caps"
        style={{ marginBottom: 8, display: "block" }}
      >
        Описание
      </label>
      <textarea
        className="input-field"
        rows={4}
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Опиши замърсяването — тип, количество, опасност…"
      />
      <label
        className="label-caps"
        style={{ marginTop: 16, marginBottom: 0, display: "block" }}
      >
        Сериозност
      </label>
      <div className="report-modal__severity-grid">
        {Object.entries(SEVERITY_META).map(([k, v]) => (
          <button
            key={k}
            className={`report-modal__severity-btn ${
              data.severity === k ? "report-modal__severity-btn--active" : ""
            }`}
            style={{
              border: `1px solid ${data.severity === k ? v.color : v.border}`,
              background: data.severity === k ? v.bg : "transparent",
              color: v.color,
            }}
            onClick={() => onChange({ severity: k })}
          >
            {v.label}
          </button>
        ))}
      </div>
      <button
        className="btn-primary"
        disabled={!ok}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 13,
          fontSize: 13,
          opacity: ok ? 1 : 0.38,
        }}
        onClick={onNext}
      >
        СЛЕДВАЩО →
      </button>
    </div>
  );
}

function Step2({ data, onChange, onNext, onBack }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const handleFile = (f) => {
    if (!f?.type.startsWith("image/")) return;
    onChange({ photoUrl: URL.createObjectURL(f) });
  };
  return (
    <div className="anim-fade-up">
      <label
        className="label-caps"
        style={{ marginBottom: 8, display: "block" }}
      >
        Снимка "ПРЕДИ"
      </label>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        GPS локацията се записва автоматично.
      </p>
      <div
        className={`drop-zone ${dragging ? "drop-zone--dragging" : ""} ${
          data.photoUrl ? "drop-zone--has-file" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt="Preview"
            style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
          />
        ) : (
          <>
            <span className="drop-zone__icon">📸</span>
            <span className="drop-zone__label">Натисни или плъзни снимка</span>
            <span className="drop-zone__hint">
              JPEG, PNG, HEIC — макс. 20MB
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div className="report-modal__gps-info">
        <span style={{ fontSize: 20 }}>📡</span>
        <div>
          <div className="report-modal__gps-coords">
            GPS: 42.6977° N, 23.3219° E
          </div>
          <div className="report-modal__gps-accuracy">
            Точност: ±5м · Записано автоматично
          </div>
        </div>
      </div>
      <div className="report-modal__btn-row">
        <button
          className="btn-ghost"
          style={{ flex: 1, padding: 12, fontSize: 13 }}
          onClick={onBack}
        >
          ← НАЗАД
        </button>
        <button
          className="btn-primary"
          style={{ flex: 2, padding: 12, fontSize: 13 }}
          onClick={onNext}
        >
          СЛЕДВАЩО →
        </button>
      </div>
    </div>
  );
}

function Step3({ data, onBack, onSubmit, loading }) {
  const meta = SEVERITY_META[data.severity];
  return (
    <div className="anim-fade-up">
      <label
        className="label-caps"
        style={{ marginBottom: 12, display: "block" }}
      >
        Преглед и потвърждение
      </label>
      <div className="report-modal__preview">
        {data.photoUrl && (
          <img
            src={data.photoUrl}
            className="report-modal__preview-img"
            alt="Report"
          />
        )}
        <div className="report-modal__preview-rows">
          {[
            { icon: "📍", key: "Местоположение", val: data.location },
            {
              icon: "📝",
              key: "Описание",
              val:
                (data.description || "").slice(0, 70) +
                ((data.description || "").length > 70 ? "…" : ""),
            },
            {
              icon: "⚠️",
              key: "Сериозност",
              val: meta?.label,
              color: meta?.color,
            },
            { icon: "📡", key: "GPS", val: "42.6977° N, 23.3219° E" },
          ].map((row) => (
            <div key={row.key} className="report-modal__preview-row">
              <span>{row.icon}</span>
              <span className="report-modal__preview-key">{row.key}:</span>
              <span
                className="report-modal__preview-val"
                style={row.color ? { color: row.color } : {}}
              >
                {row.val || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="report-modal__ai-check">
        <span style={{ fontSize: 22 }}>🤖</span>
        <div>
          <div className="report-modal__ai-title">Azure Computer Vision</div>
          <div className="report-modal__ai-status">
            {data.photoUrl
              ? "✅ Снимката съдържа отпадъци — потвърдена"
              : "⏳ Ще се провери при изпращане"}
          </div>
        </div>
        {data.photoUrl && <div className="report-modal__ai-score">95% ✓</div>}
      </div>
      <div className="report-modal__btn-row">
        <button
          className="btn-ghost"
          style={{ flex: 1, padding: 12, fontSize: 13 }}
          onClick={onBack}
        >
          ← НАЗАД
        </button>
        <button
          className="btn-primary"
          style={{ flex: 2, padding: 12, fontSize: 13 }}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner">⟳</span> Изпращане…
            </>
          ) : (
            "🚀 ИЗПРАТИ СИГНАЛ"
          )}
        </button>
      </div>
    </div>
  );
}

export default function ReportModal({ onClose }) {
  const { addReport } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    location: "",
    description: "",
    severity: "medium",
    photoUrl: null,
  });
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      addReport({
        title: form.location.split(",")[0] || "Нов сигнал",
        location: form.location,
        description: form.description,
        severity: form.severity,
        img: "📍",
        points: { critical: 200, high: 120, medium: 80, low: 40 }[
          form.severity
        ],
        district: "Sofia",
        gps: { lat: 42.6977, lng: 23.3219 },
      });
      setLoading(false);
      setDone(true);
    }, 1400);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-sheet">
        <div className="modal-handle" />
        {done ? (
          <div className="success-screen">
            <div className="success-screen__emoji">🎉</div>
            <div className="success-screen__title">СИГНАЛЪТ Е ИЗПРАТЕН!</div>
            <div className="success-screen__body">
              +15 точки добавени.
              <br />
              Благодарим, че се грижиш за Sofia! 🌿
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 28, padding: "12px 40px", fontSize: 13 }}
              onClick={onClose}
            >
              ЗАТВОРИ
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">НОВ СИГНАЛ</div>
                <div className="label-caps" style={{ marginTop: 3 }}>
                  СТЪПКА {step} ОТ 3
                </div>
              </div>
              <button className="modal-close" onClick={onClose}>
                ✕
              </button>
            </div>
            <StepBar current={step} total={3} />
            {step === 1 && (
              <Step1 data={form} onChange={update} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2
                data={form}
                onChange={update}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                data={form}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
