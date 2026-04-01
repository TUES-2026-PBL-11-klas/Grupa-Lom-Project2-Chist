import { useApp } from "../context/AppContext.jsx";
import type { Lang } from "../i18n.ts";
import { t } from "../i18n.ts";

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
}

export default function Navbar({ lang, onToggleLang }: NavbarProps) {
  const { user } = useApp();
  const i = t(lang);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-7 bg-bg-base/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-primary to-magenta flex items-center justify-center text-lg shadow-[0_0_18px_rgba(255,77,148,0.35)]">
          🌿
        </div>
        <span className="font-[Bebas_Neue,sans-serif] text-2xl tracking-[5px] text-white">
          CHIST
        </span>
        <span className="font-[Space_Mono,monospace] text-[11px] tracking-[2px] text-white/30 uppercase hidden sm:inline ml-1">
          {i.sofiaBeta}
        </span>
      </div>

      {/* Right side: stats + user */}
      <div className="flex items-center gap-5">
        {/* Signals stat */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08]">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="font-[Space_Mono,monospace] text-sm font-bold text-white tracking-wide">
            {user.points.toLocaleString()}
          </span>
        </div>

        {/* Streak stat */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08]">
          <span className="text-orange-400 text-sm">🔥</span>
          <span className="font-[Space_Mono,monospace] text-sm font-bold text-white tracking-wide">
            {user.streak} {i.days}
          </span>
        </div>

        {/* Language toggle */}
        <button
          onClick={onToggleLang}
          className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white/50 hover:text-white hover:border-pink-primary/40 hover:bg-pink-primary/10 transition-all cursor-pointer font-[Space_Mono,monospace]"
        >
          {lang === "bg" ? "BG" : "EN"}
        </button>

        {/* User avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-primary to-magenta flex items-center justify-center text-xl shadow-[0_0_24px_rgba(255,77,148,0.4)] cursor-pointer hover:shadow-[0_0_32px_rgba(255,77,148,0.6)] transition-shadow">
          {user.avatar}
        </div>
      </div>
    </nav>
  );
}
