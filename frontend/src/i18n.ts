const translations = {
  bg: {
    sofiaBeta: "София · Бета",
    days: "дни",
    signals: "сигнала",
    searchPlaceholder: "Търси сигнали...",
    filterLabel: "Подреди сигнали",
    legendLabel: "Легенда",
    recentSignals: "Последни сигнали",
    noResults: "Няма намерени сигнали",
    filterAll: "Всички",
    filterCritical: "Критични",
    filterSerious: "Сериозни",
    filterOpen: "Отворени",
    filterDone: "Завършени",
    legendCritical: "Критично",
    legendSerious: "Сериозно",
    legendMedium: "Средно",
    legendLowDone: "Леко / Завършено",
    sevCritical: "Критично",
    sevHigh: "Сериозно",
    sevMedium: "Средно",
    sevLow: "Леко",
    statusOpen: "Отворен",
    statusInProgress: "В процес",
    statusDone: "Завършен",
    claimTask: "🧹 Поеми задачата",
    completeTask: "✅ Завърши",
    completed: "Завършено",
  },
  en: {
    sofiaBeta: "Sofia · Beta",
    days: "days",
    signals: "signals",
    searchPlaceholder: "Search signals...",
    filterLabel: "Filter signals",
    legendLabel: "Legend",
    recentSignals: "Recent signals",
    noResults: "No signals found",
    filterAll: "All",
    filterCritical: "Critical",
    filterSerious: "Serious",
    filterOpen: "Open",
    filterDone: "Completed",
    legendCritical: "Critical",
    legendSerious: "Serious",
    legendMedium: "Medium",
    legendLowDone: "Low / Completed",
    sevCritical: "Critical",
    sevHigh: "Serious",
    sevMedium: "Medium",
    sevLow: "Low",
    statusOpen: "Open",
    statusInProgress: "In progress",
    statusDone: "Completed",
    claimTask: "🧹 Claim task",
    completeTask: "✅ Complete",
    completed: "Completed",
  },
} as const;

/* English translations for report titles and locations, keyed by report id */
const reportTranslations: Record<number, { title: string; location: string; description: string }> = {
  1:  { title: "Polluted park — Borisova", location: "Borisova Garden, Entrance 3", description: "Large amount of waste dumped near the playground. Plastic bags, bottles, and old furniture visible." },
  2:  { title: "Waste near container", location: "Lyulin 5, bl. 514", description: "The container is overflowing and waste is scattered around it within a 3-4 meter radius." },
  3:  { title: "Illegal dump site", location: "Vitosha Blvd, behind the shops", description: "Large illegal dump with electronics, construction materials, and mixed household waste. At least 4 volunteers needed." },
  4:  { title: "Glass on the sidewalk", location: "Student City, bl. 12", description: "Broken bottle on the pedestrian crossing near the bus stop." },
  5:  { title: "Abandoned furniture", location: "Nadezhda, ul. 205", description: "Abandoned sofa, mattress, and table blocking the sidewalk in the residential area." },
  6:  { title: "Cigarette butts near fountain", location: "Bulgaria Sq., around the fountain", description: "Numerous cigarette butts and paper waste around the central fountain." },
  7:  { title: "Construction waste", location: "Mladost 1, near bl. 37", description: "Construction waste — concrete, bricks, and rebar — dumped on the green area next to the block." },
  8:  { title: "Plastic in the river", location: "Perlovska River, near Slivnitsa Blvd", description: "Plastic bottles and bags polluting the riverbed. A coordinated action is needed." },
  9:  { title: "Graffiti and litter", location: "NDK Underpass", description: "Accumulated waste and graffiti in the underpass. Cleaning includes repainting." },
  10: { title: "Hazardous waste — batteries", location: "Druzhba 2, near school", description: "Discarded batteries and electronic components in close proximity to a school yard. Urgent!" },
};

export type Lang = "bg" | "en";
export type T = Record<keyof (typeof translations)["bg"], string>;

export function t(lang: Lang): T {
  return translations[lang];
}

export function translateReport(lang: Lang, report: { id: number; title: string; location: string; description?: string }) {
  if (lang === "bg") return { title: report.title, location: report.location, description: report.description ?? "" };
  const tr = reportTranslations[report.id];
  if (!tr) return { title: report.title, location: report.location, description: report.description ?? "" };
  return tr;
}
