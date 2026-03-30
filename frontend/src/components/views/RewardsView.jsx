import { useState } from "react";
import "./RewardsView.css";
import { useApp } from "../../context/AppContext.jsx";

const REWARDS = [
  {
    id: 1,
    emoji: "☕",
    name: "Безплатно кафе",
    desc: "Една безплатна напитка в партньорски кафенета в Sofia.",
    partner: "COSTA COFFEE · STARBUCKS",
    cost: 500,
    category: "food",
    featured: true,
    hot: true,
  },
  {
    id: 2,
    emoji: "🌳",
    name: "Засади дърво",
    desc: "Организираме засаждане на дърво в твое име в парк в Sofia.",
    partner: "SOFIA GREEN INITIATIVE",
    cost: 800,
    category: "eco",
    featured: false,
  },
  {
    id: 3,
    emoji: "🎟️",
    name: "Безплатен транспорт",
    desc: "Карта за градски транспорт за 1 месец.",
    partner: "ЦЕНТЪРА ЗА ГРАДСКА МОБИЛНОСТ",
    cost: 1200,
    category: "transport",
    featured: false,
    newBadge: true,
  },
  {
    id: 4,
    emoji: "🍕",
    name: "Отстъпка 20% храна",
    desc: "20% намаление в партньорски ресторанти.",
    partner: "HAPPY · HAPPY BAR & GRILL",
    cost: 350,
    category: "food",
    featured: false,
  },
  {
    id: 5,
    emoji: "♻️",
    name: "Еко продуктов пакет",
    desc: "Комплект от биоразградими продукти от SofiaEco.",
    partner: "SOFIAECO STORE",
    cost: 600,
    category: "eco",
    featured: false,
  },
  {
    id: 6,
    emoji: "🏅",
    name: "Verified User статус",
    desc: "Получи официалния VRF badge и 2x точки за всяка задача.",
    partner: "CLEAN&WIN PLATFORM",
    cost: 3000,
    category: "status",
    featured: false,
  },
  {
    id: 7,
    emoji: "🎫",
    name: "Концерт / Събитие",
    desc: "2 безплатни билета за партньорско събитие в Sofia.",
    partner: "SOFIA LIVE",
    cost: 2000,
    category: "experience",
    featured: false,
    newBadge: true,
  },
  {
    id: 8,
    emoji: "🧴",
    name: "Почистващ комплект",
    desc: "Професионален еко комплект за почистване — ръкавици, торби, инструменти.",
    partner: "ECO TOOLS BG",
    cost: 400,
    category: "eco",
    featured: false,
  },
];

const HISTORY = [
  {
    id: 1,
    emoji: "☕",
    name: "Безплатно кафе",
    date: "12 Май 2025",
    pts: -500,
  },
  {
    id: 2,
    emoji: "🧹",
    name: "Завърши задача",
    date: "10 Май 2025",
    pts: +120,
  },
  { id: 3, emoji: "📍", name: "Нов сигнал", date: "9 Май 2025", pts: +15 },
  {
    id: 4,
    emoji: "🔥",
    name: "7-дневен стрийк бонус",
    date: "7 Май 2025",
    pts: +100,
  },
  {
    id: 5,
    emoji: "🍕",
    name: "Отстъпка 20% храна",
    date: "2 Май 2025",
    pts: -350,
  },
];

const CATS = ["all", "food", "eco", "transport", "experience", "status"];

function ClaimConfirm({ reward, onConfirm, onCancel }) {
  return (
    <div
      className="rewards__claim-confirm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="rewards__claim-card">
        <span className="rewards__claim-emoji">{reward.emoji}</span>
        <div className="rewards__claim-title">ПОТВЪРДИ РАЗМЯНА</div>
        <div className="rewards__claim-desc">
          <strong style={{ color: "var(--text-primary)" }}>
            {reward.name}
          </strong>
          <br />
          {reward.desc}
          <br />
          <br />
          <span style={{ color: "var(--text-muted)" }}>
            Партньор: {reward.partner}
          </span>
        </div>
        <div className="rewards__claim-cost">
          ⭐ {reward.cost.toLocaleString()} точки
        </div>
        <div className="rewards__claim-btns">
          <button
            className="btn-ghost rewards__claim-cancel"
            onClick={onCancel}
          >
            ОТКАЗ
          </button>
          <button className="btn-primary rewards__claim-ok" onClick={onConfirm}>
            РАЗМЕНИ →
          </button>
        </div>
      </div>
    </div>
  );
}

function RewardCard({ reward, userPoints, claimed, onClaim }) {
  const canAfford = userPoints >= reward.cost;
  const isLocked = !canAfford && !claimed;
  const progress = Math.min((userPoints / reward.cost) * 100, 100);
  const needMore = reward.cost - userPoints;

  let cardClass = "reward-card";
  if (claimed) cardClass += " reward-card--claimed";
  else if (isLocked) cardClass += " reward-card--locked";
  else cardClass += " reward-card--available";
  if (reward.featured) cardClass += " reward-card--featured";

  return (
    <div
      className={cardClass}
      onClick={() => !isLocked && !claimed && onClaim(reward)}
    >
      {reward.hot && <span className="reward-card__hot">🔥 HOT</span>}
      {reward.newBadge && <span className="reward-card__new">✨ NEW</span>}

      <span className="reward-card__emoji">{reward.emoji}</span>

      <div className="reward-card__body">
        <div className="reward-card__name">{reward.name}</div>
        <div className="reward-card__desc">{reward.desc}</div>
        <div className="reward-card__partner">{reward.partner}</div>

        {isLocked && (
          <div className="reward-card__progress">
            <div className="reward-card__progress-bar">
              <div
                className="reward-card__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="reward-card__progress-label">
              Нужни още {needMore.toLocaleString()} pts
            </div>
          </div>
        )}
      </div>

      <div className="reward-card__footer">
        <span
          className={`reward-card__cost ${
            isLocked ? "reward-card__cost--locked" : ""
          }`}
        >
          ⭐ {reward.cost.toLocaleString()}
        </span>
        {claimed && <span className="reward-card__claimed-tag">✓ Взето</span>}
        {isLocked && <span className="reward-card__lock-icon">🔒</span>}
        {!claimed && !isLocked && (
          <button
            className="btn-primary reward-card__claim-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClaim(reward);
            }}
          >
            РАЗМЕНИ
          </button>
        )}
      </div>
    </div>
  );
}

export default function RewardsView() {
  const { user, dispatch } = useApp();
  const [cat, setCat] = useState("all");
  const [tab, setTab] = useState("shop");
  const [claimed, setClaimed] = useState(new Set());
  const [pending, setPending] = useState(null);

  const filtered = REWARDS.filter((r) => cat === "all" || r.category === cat);
  const featured = filtered.find((r) => r.featured);
  const rest = filtered.filter((r) => !r.featured);

  const handleClaim = (reward) => {
    if (user.points < reward.cost || claimed.has(reward.id)) return;
    setPending(reward);
  };

  const confirmClaim = () => {
    if (!pending) return;
    dispatch({ type: "SPEND_POINTS", payload: pending.cost });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "success",
        message: `${pending.emoji} ${pending.name} — взето успешно!`,
        duration: 4000,
      },
    });
    setClaimed((prev) => new Set([...prev, pending.id]));
    setPending(null);
  };

  return (
    <div className="rewards">
      {pending && (
        <ClaimConfirm
          reward={pending}
          onConfirm={confirmClaim}
          onCancel={() => setPending(null)}
        />
      )}

      <div className="label-caps">Награди · Размени точки</div>

      {/* Points hero */}
      <div className="rewards__points-hero">
        <div className="rewards__points-hero-glow" />
        <div className="rewards__balance-label">НАЛИЧНИ ТОЧКИ</div>
        <div className="rewards__balance-value">
          {user.points.toLocaleString()}
        </div>
        <div className="rewards__balance-sub">⭐ CLEAN&WIN POINTS</div>
        <div className="rewards__quick-stats">
          {[
            { val: user.cleanings, key: "ПОЧИСТВАНИЯ" },
            { val: user.reports, key: "СИГНАЛИ" },
            { val: user.streak, key: "СТРИЙК" },
          ].map((s) => (
            <div key={s.key} className="rewards__qs-item">
              <div className="rewards__qs-val">{s.val}</div>
              <div className="rewards__qs-key">{s.key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop / History tabs */}
      <div
        style={{
          display: "flex",
          background: "rgba(74,222,128,0.06)",
          borderRadius: "var(--radius-md)",
          padding: 4,
          gap: 4,
        }}
      >
        {[
          { id: "shop", label: "🛍️ Магазин" },
          { id: "history", label: "📋 История" },
        ].map((t) => (
          <button
            key={t.id}
            style={{
              flex: 1,
              padding: "9px 0",
              border: "none",
              borderRadius: 10,
              background:
                tab === t.id
                  ? "linear-gradient(135deg,#4ade80,#16a34a)"
                  : "transparent",
              color: tab === t.id ? "#050e08" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 1,
              transition: "all .2s",
            }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "shop" && (
        <>
          {/* Category filter */}
          <div className="rewards__section-header">
            <span className="label-caps">Категории</span>
            <div className="rewards__filter-tabs">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={`rewards__filter-tab ${
                    cat === c
                      ? "rewards__filter-tab--active"
                      : "rewards__filter-tab--inactive"
                  }`}
                  onClick={() => setCat(c)}
                >
                  {c === "all" ? "ВСИЧКИ" : c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="rewards__grid">
            {featured && (
              <RewardCard
                key={featured.id}
                reward={featured}
                userPoints={user.points}
                claimed={claimed.has(featured.id)}
                onClaim={handleClaim}
              />
            )}
            {rest.map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                userPoints={user.points}
                claimed={claimed.has(r.id)}
                onClaim={handleClaim}
              />
            ))}
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="rewards__history stagger">
          {HISTORY.map((h) => (
            <div key={h.id} className="rewards__history-item anim-fade-up">
              <div
                className="rewards__history-icon"
                style={{
                  background:
                    h.pts > 0 ? "rgba(74,222,128,0.1)" : "rgba(255,59,59,0.1)",
                  border: `1px solid ${
                    h.pts > 0 ? "rgba(74,222,128,0.3)" : "rgba(255,59,59,0.25)"
                  }`,
                }}
              >
                {h.emoji}
              </div>
              <div className="rewards__history-body">
                <div className="rewards__history-name">{h.name}</div>
                <div className="rewards__history-date">{h.date}</div>
              </div>
              <div
                className="rewards__history-pts"
                style={{
                  color: h.pts > 0 ? "var(--green-bright)" : "var(--red-alert)",
                }}
              >
                {h.pts > 0 ? "+" : ""}
                {h.pts}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
