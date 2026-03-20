import { useEffect, useRef } from "react";
import "./MapView.css";
import { SEVERITY_META, STATUS_META } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function makeIcon(report) {
  const meta = SEVERITY_META[report.severity];
  const color = report.status === "done" ? "#4ade80" : meta.color;
  const emoji = report.status === "done" ? "✅" : report.img;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <defs>
      <filter id="glow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="0.7"/>
      </filter>
    </defs>
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z"
          fill="${color}" filter="url(#glow)" opacity="0.92"/>
    <circle cx="18" cy="18" r="11" fill="rgba(0,0,0,0.28)"/>
    <text x="18" y="23" text-anchor="middle" font-size="12" dominant-baseline="auto">${emoji}</text>
  </svg>`;
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:44px">${svg}</div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

function buildPopup(report) {
  const meta = SEVERITY_META[report.severity];
  const sMeta = STATUS_META[report.status];
  const color = report.status === "done" ? "#4ade80" : meta.color;
  const btn =
    report.status === "open"
      ? `<button class="btn-primary map-popup-btn" data-claim="${report.id}">🧹 ПОЕМИ ЗАДАЧАТА</button>`
      : "";
  return `
    <div class="map-popup-body">
      <div class="map-popup-title" style="color:${color}">${report.title}</div>
      <div class="map-popup-loc">📍 ${report.location}</div>
      <div class="map-popup-tags">
        <span class="tag" style="background:${meta.bg};color:${meta.color};border:1px solid ${meta.border}">${meta.label}</span>
        <span class="tag" style="background:${sMeta.bg};color:${sMeta.color}">${sMeta.label}</span>
        <span class="map-popup-pts">+${report.points} pts</span>
      </div>
      ${btn}
    </div>`;
}

export default function MapView({
  reports,
  height = 300,
  showControls = true,
}) {
  const { claimReport } = useApp();
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(wrapRef.current, {
      center: [42.698, 23.322],
      zoom: 12,
      zoomControl: showControls,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [showControls]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    reports.forEach((r) => {
      if (!r.gps) return;
      const marker = L.marker([r.gps.lat, r.gps.lng], { icon: makeIcon(r) });
      marker.bindPopup(
        L.popup({ minWidth: 220, closeButton: true }).setContent(buildPopup(r)),
      );
      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.querySelector(`[data-claim="${r.id}"]`);
          if (btn)
            btn.onclick = () => {
              claimReport(r.id);
              marker.closePopup();
            };
        }, 50);
      });
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [reports, claimReport]);

  return (
    <div className="map-wrap" style={{ height }}>
      <div ref={wrapRef} style={{ width: "100%", height: "100%" }} />
      <div className="map-live-badge">
        <span className="map-live-badge__dot" />
        SOFIA · GPS · LIVE
      </div>
    </div>
  );
}
