# MapLibre Dashboard Redesign

## Overview

Replace the existing Leaflet-based map views (`MapView.jsx`, `HomeView.jsx`, `MapPageView.jsx`) with a unified MapLibre GL JS dashboard using React + TypeScript + Tailwind CSS. The new design uses a dark + pinkish/magenta aesthetic centered on Sofia, Bulgaria.

## Theme

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#0F172A` | Page/sidebar background |
| `pink-primary` | `#FF4D94` | Primary accent, active states, CTA |
| `magenta` | `#C026D3` | Secondary accent, highlights |
| `pink-light` | `#F472B6` | Tertiary accent, hover states |
| White | `#FFFFFF` | Text, icons |

## Layout

```
+--[ Navbar (56px, full width) ]--------------------+
| CHIST logo | stats (signals, streak) | lang | user|
+--------+------------------------------------------+
| Sidebar| Map (MapLibre GL JS, fills remaining)    |
| 320px  |                                          |
| fixed  |                                          |
|        |                                          |
| search |                                          |
| filters|                                          |
| legend |                                          |
| cards  |                                          |
+--------+------------------------------------------+
```

### Responsive

- **Desktop (>=768px)**: Sidebar 320px fixed left, map fills rest
- **Mobile (<768px)**: Map full width, sidebar as slide-up drawer with drag handle

## Component Tree

```
MapDashboard.tsx          # Layout orchestrator, filter state
  Navbar.tsx              # Top bar: logo, stats, user avatar
  Sidebar.tsx             # Left panel container
    FilterChips.tsx       # Severity/status filter buttons
    SignalCard.tsx         # Individual report card in list
  MapContainer.tsx        # MapLibre map, markers, popups
    MarkerPopup.tsx       # Popup content when clicking marker
```

## Data Flow

- All data consumed from existing `AppContext` (reports, user)
- Filter state (`activeFilter`, `searchQuery`) lives as local state in `MapDashboard`
- Filtered reports passed to both `Sidebar` (card list) and `MapContainer` (markers)
- Clicking a `SignalCard` calls `flyTo()` on the map and opens the popup
- Clicking a marker opens its popup and highlights the sidebar card

## Map Configuration

- **Library**: `@vis.gl/react-maplibre` + `maplibre-gl`
- **Style**: CartoDB Dark Matter GL (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`)
- **Center**: Sofia `[23.3219, 42.6977]`
- **Zoom**: 12
- **Markers**: HTML overlay markers using `maplibre-gl` `Marker` class with custom CSS
  - Colors by severity: red (#EF4444) = critical, orange (#F97316) = serious, yellow (#EAB308) = moderate, green (#22C55E) = completed
  - CSS `box-shadow` glow effect matching marker color
- **Popups**: Custom styled with pink accent border, dark bg, report details + action buttons

## Filter Chips

| Label | Filter | Dot Color |
|-------|--------|-----------|
| Всички | show all | white |
| Критични | severity === "critical" | red |
| Сериозни | severity === "high" | orange |
| Отворени | status === "open" | blue |
| Завършени | status === "done" | green |

## Files to Remove

- `src/components/MapView.jsx` + `src/styles/MapView.css`
- `src/pages/HomeView.jsx` + `src/styles/HomeView.css`
- `src/pages/MapPageView.jsx` + `src/styles/MapPageView.css`
- `leaflet` dependency from `package.json`

## Files to Create

- `src/components/MapDashboard.tsx`
- `src/components/Navbar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/MapContainer.tsx`
- `src/components/SignalCard.tsx`
- `src/components/FilterChips.tsx`
- `src/components/MarkerPopup.tsx`

## Files to Modify

- `src/Main.jsx` — import and render `MapDashboard` instead of old views
- `package.json` — add maplibre-gl, @vis.gl/react-maplibre, tailwindcss, typescript; remove leaflet
- `vite.config.js` — ensure TSX support
- `tsconfig.json` — new file
- `tailwind.config.js` — new file with custom theme colors
- `src/styles/global.css` — add Tailwind directives

## Project Setup Changes

1. Add `tsconfig.json` with JSX support, strict mode, allow JS
2. Add `tailwind.config.js` extending colors with theme tokens
3. Add Tailwind directives (`@tailwind base/components/utilities`) to global CSS
4. Install: `typescript`, `tailwindcss @tailwindcss/vite`, `maplibre-gl`, `@vis.gl/react-maplibre`
5. Remove: `leaflet`
