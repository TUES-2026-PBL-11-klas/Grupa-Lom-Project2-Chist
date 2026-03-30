import { useState } from "react";
import "./LeaderboardView.css";
import { LEADERBOARD, BADGES } from "../../data/mockData.js";
import { useApp } from "../../context/AppContext.jsx";

const RANK_COLORS = ["#f5c518", "#94a3b8", "#cd7f32"];
const PERIODS = [
  { id: "awards", label: "НАГРАДИ" },
  { id: "cleanings", label: "ПОЧИСТВАНИЯ" },
  { id: "points", label: "ТОЧКИ" },
];

// Map user data with earned badges count
const usersWithAwards = LEADERBOARD.map((user) => {
  const earnedBadges = BADGES.filter((badge) => {
    // Calculate earned badges based on user stats
    if (badge.id === "first_report" && user.cleanings > 0) return true;
    if (badge.id === "first_clean" && user.cleanings > 0) return true;
    if (badge.id === "streak_7" && user.streak >= 7) return true;
    if (badge.id === "clean_10" && user.cleanings >= 10) return true;
    if (badge.id === "verified" && user.verified) return true;
    if (badge.id === "eco_legend" && user.points >= 5000) return true;
    if (badge.id === "district_hero" && user.cleanings >= 5) return true;
    if (badge.id === "team_player" && user.cleanings >= 20) return true;
    return false;
  });
  return { ...user, awards: earnedBadges.length, earnedBadges };
});

function Podium({ top3 }) {
  const order = [top3[1], top3[0], top3[2]];
  const heights = [90, 124, 76];
  const sizes = [18, 24, 16];
  const positions = [2, 1, 3];

  return (
    <div className="leaderboard__podium">
      {order.map((user, i) => (
        <div key={user.id} className="leaderboard__podium-item">
          {positions[i] === 1 && (
            <div className="leaderboard__podium-crown anim-float">👑</div>
          )}
          <div
            className="leaderboard__podium-avatar"
            style={{ fontSize: sizes[i] }}
          >
            {user.avatar}
          </div>
          <div
            className="leaderboard__podium-name"
            style={{
              color:
                positions[i] === 1 ? RANK_COLORS[0] : "var(--text-secondary)",
            }}
          >
            {user.name}
          </div>
          <div
            className="leaderboard__podium-col"
            style={{
              width: positions[i] === 1 ? 84 : 70,
              height: heights[i],
              background: `linear-gradient(180deg,${RANK_COLORS[i]}22,${RANK_COLORS[i]}08)`,
              border: `1px solid ${RANK_COLORS[i]}44`,
              boxShadow:
                positions[i] === 1 ? `0 0 20px ${RANK_COLORS[0]}22` : "none",
            }}
          >
            <div
              className="leaderboard__podium-rank"
              style={{ color: RANK_COLORS[i], fontSize: sizes[i] - 2 }}
            >
              #{positions[i]}
            </div>
            <div
              className="leaderboard__podium-pts"
              style={{ color: `${RANK_COLORS[i]}aa` }}
            >
              {user.awards} 🏆
            </div>
            <div className="leaderboard__podium-icon">{user.levelIcon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderRow({ user, isMe, index, sortBy }) {
  const rankColor = index < 3 ? RANK_COLORS[index] : null;

  const getValue = () => {
    if (sortBy === "awards") return user.awards;
    if (sortBy === "cleanings") return user.cleanings;
    return user.points;
  };

  const getLabel = () => {
    if (sortBy === "awards") return "🏆 НАГРАДИ";
    if (sortBy === "cleanings") return "🧹 ПОЧИСТВАНИЯ";
    return "⭐ ТОЧКИ";
  };

  return (
    <div
      className={`leaderboard__row ${
        isMe ? "leaderboard__row--me" : "leaderboard__row--other"
      } anim-fade-up`}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div
        className="leaderboard__rank-badge"
        style={{
          background: rankColor ? `${rankColor}22` : "rgba(74,222,128,0.06)",
          border: rankColor
            ? `1px solid ${rankColor}44`
            : "1px solid transparent",
          color: rankColor || "var(--text-muted)",
        }}
      >
        #{index + 1}
      </div>
      <span className="leaderboard__row-avatar">{user.avatar}</span>
      <div className="leaderboard__row-info">
        <div
          className="leaderboard__row-name"
          style={{
            color: isMe ? "var(--green-bright)" : "var(--text-primary)",
          }}
        >
          {user.name}
          {user.verified && (
            <span className="leaderboard__verified-badge">✓</span>
          )}
          {isMe && <span className="leaderboard__me-badge">ТИ</span>}
        </div>
        <div className="leaderboard__row-meta">
          <span>
            {user.levelIcon} {user.level}
          </span>
          {user.streak > 0 && (
            <span style={{ color: "rgba(245,197,24,0.65)" }}>
              · 🔥 {user.streak}
            </span>
          )}
          <span style={{ color: "rgba(74,222,128,0.3)" }}>
            · 🧹 {user.cleanings}
          </span>
        </div>
        {sortBy === "awards" && user.earnedBadges.length > 0 && (
          <div className="leaderboard__badges-preview">
            {user.earnedBadges.slice(0, 3).map((badge) => (
              <span key={badge.id} title={badge.name}>
                {badge.icon}
              </span>
            ))}
            {user.earnedBadges.length > 3 && (
              <span className="leaderboard__more-badges">
                +{user.earnedBadges.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="leaderboard__row-pts-col">
        <div
          className="leaderboard__row-pts"
          style={{ color: rankColor || "var(--green-bright)" }}
        >
          {getValue().toLocaleString()}
        </div>
        <div className="leaderboard__row-pts-label">{getLabel()}</div>
      </div>
    </div>
  );
}

export default function LeaderboardView() {
  const { user } = useApp();
  const [sortBy, setSortBy] = useState("awards");

  const sortedData = [...usersWithAwards]
    .sort((a, b) => {
      if (sortBy === "awards") return b.awards - a.awards;
      if (sortBy === "cleanings") return b.cleanings - a.cleanings;
      return b.points - a.points;
    })
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const myEntry = sortedData.find((u) => u.name === user.name);
  const top3 = sortedData.slice(0, 3);

  return (
    <div className="leaderboard">
      <div className="label-caps">Класация · Топ доброволци</div>

      <div className="leaderboard__tabs">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={`leaderboard__tab ${
              sortBy === p.id
                ? "leaderboard__tab--active"
                : "leaderboard__tab--inactive"
            }`}
            onClick={() => setSortBy(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Podium top3={top3} />

      {myEntry && (
        <div className="leaderboard__my-rank">
          <span className="leaderboard__my-rank-label">Твоята позиция:</span>
          <span className="leaderboard__my-rank-val">
            #{myEntry.rank} ·{" "}
            {sortBy === "awards"
              ? myEntry.awards + " 🏆"
              : sortBy === "cleanings"
                ? myEntry.cleanings + " 🧹"
                : myEntry.points.toLocaleString() + " ⭐"}
          </span>
        </div>
      )}

      <div className="leaderboard__list">
        {sortedData.map((u, i) => (
          <LeaderRow
            key={u.id}
            user={u}
            isMe={u.name === user.name}
            index={i}
            sortBy={sortBy}
          />
        ))}
      </div>
    </div>
  );
}
