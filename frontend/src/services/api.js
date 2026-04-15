// src/services/api.js  —  REST API layer for Spring Boot backend
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

function getToken() { return localStorage.getItem("cw_token"); }

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const res   = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) { localStorage.removeItem("cw_token"); window.location.href = "/"; return; }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message ?? `HTTP ${res.status}`); }
  if (res.status === 204) return null;
  return res.json();
}

export const authApi = {
  register: p    => request("/auth/register", { method:"POST", body: JSON.stringify(p) }),
  login:    (e,p)=> request("/auth/login",    { method:"POST", body: JSON.stringify({ email:e, password:p }) }),
  refresh:  tok  => request("/auth/refresh",  { method:"POST", body: JSON.stringify({ refreshToken:tok }) }),
  logout:   ()   => request("/auth/logout",   { method:"POST" }),
};

export const reportsApi = {
  list:     (params={})   => {
    if (params.status) return request(`/reports/status/${params.status}`);
    if (params.userId) return request(`/reports/user/${params.userId}`);
    return request("/reports");
  },
  getById:  id            => request(`/reports/${id}`),
  create:   (userId, payload) => request("/reports", { method:"POST", headers:{ "X-User-Id": userId }, body: JSON.stringify(payload) }),
  updateStatus: (id,status) => request(`/reports/${id}/status?status=${status}`, { method:"PATCH" }),
  remove: id => request(`/reports/${id}`, { method:"DELETE" }),
};

export const usersApi = {
  getMe:      ()  => request("/users/me"),
  updateMe:   p   => request("/users/me",           { method:"PATCH", body: JSON.stringify(p) }),
  getById:    id  => request(`/users/${id}`),
  getBadges:  ()  => request("/users/me/badges"),
  getActivity:(pg=0)=> request(`/users/me/activity?page=${pg}&size=20`),
  getStats:   ()  => request("/users/me/stats"),
};

export const leaderboardApi = {
  get: (period="week", page=0) => request(`/leaderboard?period=${period}&page=${page}&size=20`),
};

export const aiApi = {
  verifyImage:   fd => request("/ai/verify-image",   { method:"POST", headers:{}, body:fd }),
  compareImages: fd => request("/ai/compare-images", { method:"POST", headers:{}, body:fd }),
};

export const statsApi = {
  getGlobal:     () => request("/stats/global"),
  getByDistrict: () => request("/stats/districts"),
};

export const notificationsApi = {
  list:       (unread=false) => request(`/notifications${unread?"?unread=true":""}`),
  markRead:   id             => request(`/notifications/${id}/read`, { method:"PATCH" }),
  markAllRead:()             => request("/notifications/read-all",   { method:"PATCH" }),
};

export const tasksApi = {
  create: (userId, reportId) =>
    request("/tasks", {
      method: "POST",
      headers: { "X-User-Id": userId },
      body: JSON.stringify({ reportId }),
    }),
  complete: (id) => request(`/tasks/${id}/complete`, { method: "PATCH" }),
};

export default { auth:authApi, reports:reportsApi, users:usersApi, leaderboard:leaderboardApi, ai:aiApi, stats:statsApi, notifications:notificationsApi, tasks:tasksApi };
