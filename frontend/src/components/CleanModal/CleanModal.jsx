import { useState, useRef } from "react";
import "./CleanModal.css";
import { SEVERITY_META } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";

export default function CleanModal({ report, onClose }) {
  const { completeReport } = useApp();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [gpsOk, setGpsOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef();

  if (!report) return null;
  const meta = SEVERITY_META[report.severity ?? "medium"];

  const handleFile = (f) => {
    if (!f?.type.startsWith("image/")) return;
    setPhotoUrl(URL.createObjectURL(f));
    setAiResult("pending");
    setTimeout(() => {
      setGpsOk(true);
      setAiResult("pass");
    }, 1800);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      completeReport(report.id);
      setLoading(false);
      setDone(true);
    }, 1200);
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
            <div className="success-screen__title">ЗАВЪРШЕНО!</div>
            <div className="success-screen__body">
              +{report.points} точки добавени!
              <br />
              Благодарим, Sofia е по-чиста с теб! 🌿
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              {["⭐", "🔥", "🏆"].map((e, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 28,
                    animation: `floatY ${1.5 + i * 0.3}s ease-in-out infinite`,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 24, padding: "12px 40px", fontSize: 13 }}
              onClick={onClose}
            >
              ЗАТВОРИ
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">ЗАВЪРШИ ЗАДАЧАТА</div>
                <div className="label-caps" style={{ marginTop: 3 }}>
                  +{report.points} ТОЧКИ ПРИ УСПЕХ
                </div>
              </div>
              <button className="modal-close" onClick={onClose}>
                ✕
              </button>
            </div>

            <div
              className="clean-modal__task-info"
              style={{
                background: meta.bg,
                border: `1px solid ${meta.border}`,
              }}
            >
              <span className="clean-modal__task-icon">{report.img}</span>
              <div>
                <div className="clean-modal__task-title">{report.title}</div>
                <div className="clean-modal__task-loc">
                  📍 {report.location}
                </div>
              </div>
              <span
                className="clean-modal__task-sev"
                style={{
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  color: meta.color,
                }}
              >
                {meta.label}
              </span>
            </div>

            <div className="clean-modal__steps">
              <div
                className={`clean-modal__step ${
                  gpsOk ? "clean-modal__step--ok" : "clean-modal__step--pending"
                }`}
              >
                <span className="clean-modal__step-icon">📡</span>
                <div className="clean-modal__step-body">
                  <div className="clean-modal__step-title">GPS Верификация</div>
                  <div className="clean-modal__step-detail">
                    {gpsOk
                      ? "42.6977° N, 23.3219° E · ±5м"
                      : "Изчакване на локация…"}
                  </div>
                </div>
                <span
                  className="clean-modal__step-badge"
                  style={{
                    color: gpsOk ? "var(--green-bright)" : "var(--text-muted)",
                  }}
                >
                  {gpsOk ? "✓ OK" : "⏳"}
                </span>
              </div>

              <div>
                <label className="label-caps clean-modal__photo-label">
                  Снимка "СЛЕД" почистването
                </label>
                <div
                  className={`drop-zone ${
                    photoUrl ? "drop-zone--has-file" : ""
                  }`}
                  onClick={() => inputRef.current?.click()}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="After"
                      style={{
                        width: "100%",
                        maxHeight: 180,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <span className="drop-zone__icon">📸</span>
                      <span className="drop-zone__label">
                        Снимай почистеното място
                      </span>
                    </>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {aiResult && (
                <div className={`clean-modal__ai clean-modal__ai--${aiResult}`}>
                  <span className="clean-modal__ai-icon">🤖</span>
                  <div>
                    <div
                      className="clean-modal__ai-title"
                      style={{
                        color:
                          aiResult === "pass"
                            ? "var(--green-bright)"
                            : aiResult === "fail"
                              ? "var(--red-alert)"
                              : "var(--amber)",
                      }}
                    >
                      Azure Computer Vision
                    </div>
                    <div className="clean-modal__ai-desc">
                      {aiResult === "pending" && "Анализиране на снимката…"}
                      {aiResult === "pass" &&
                        "✅ Чисто! Местото изглежда почистено."}
                      {aiResult === "fail" &&
                        "❌ Снимката не показва почистено място."}
                    </div>
                  </div>
                  {aiResult === "pending" && (
                    <span
                      className="spinner"
                      style={{ fontSize: 18, color: "var(--amber)" }}
                    >
                      ⟳
                    </span>
                  )}
                  {aiResult === "pass" && (
                    <div className="clean-modal__ai-score">97% ✓</div>
                  )}
                </div>
              )}
            </div>

            <button
              className="btn-primary clean-modal__submit"
              disabled={!photoUrl || aiResult !== "pass" || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner">⟳</span> Изпращане…
                </>
              ) : (
                `✅ ПОТВЪРДИ ПОЧИСТВАНЕТО (+${report.points} pts)`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
