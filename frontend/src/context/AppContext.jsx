import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { CURRENT_USER, REPORTS, ACTIVITY_FEED } from "../data/mockData.js";
import { reportsApi, usersApi, tasksApi } from "../services/api.js";

const initialState = {
  user: CURRENT_USER,
  reports: REPORTS,
  activityFeed: ACTIVITY_FEED,
  notifications: [],
  selectedReportId: null,
};

function mapBackendStatus(status) {
  switch (status) {
    case "IN_PROGRESS":
      return "in-progress";
    case "CLEANED":
      return "done";
    case "NEW":
    default:
      return "open";
  }
}

function mapBackendReport(report, idx = 0) {
  const severityOrder = ["low", "medium", "high", "critical"];
  return {
    id: report.reportId ?? report.id ?? `${idx}`,
    title: (report.description || "Сигнал").slice(0, 32),
    location: "София",
    district: "София",
    lat: report.latitude ?? 42.6977,
    lng: report.longitude ?? 23.3219,
    status: mapBackendStatus(report.status),
    severity: severityOrder[idx % severityOrder.length],
    img: "📍",
    points: { NEW: 40, IN_PROGRESS: 80, CLEANED: 120 }[report.status] ?? 40,
    reporter: "Потребител",
    reporterAvatar: "👤",
    time: "сега",
    description: report.description ?? "",
    volunteers: 0,
    confirmedBy: [],
    aiVerified: false,
    gps: {
      lat: report.latitude ?? 42.6977,
      lng: report.longitude ?? 23.3219,
    },
  };
}

function mapBackendUser(user) {
  return {
    ...CURRENT_USER,
    id: user.id,
    name: user.username || CURRENT_USER.name,
    points: user.points ?? CURRENT_USER.points,
    streak: user.streak ?? CURRENT_USER.streak,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_REPORT": {
      const r = {
        ...action.payload,
        id: state.reports.length + 1,
        reporter: state.user.name,
        reporterAvatar: state.user.avatar,
        time: "just now",
        status: "open",
        volunteers: 0,
        confirmedBy: [],
        aiVerified: false,
      };
      const feed = {
        id: Date.now(),
        user: state.user.name,
        userAvatar: state.user.avatar,
        action: "докладва",
        place: r.location,
        pts: "+15",
        time: "сега",
        type: "report",
      };
      return {
        ...state,
        reports: [r, ...state.reports],
        activityFeed: [feed, ...state.activityFeed],
        user: {
          ...state.user,
          points: state.user.points + 15,
          reports: state.user.reports + 1,
        },
      };
    }

    case "CLAIM_REPORT":
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload
            ? {
                ...r,
                status: "in-progress",
                claimedBy: state.user.name,
                volunteers: r.volunteers + 1,
              }
            : r,
        ),
      };

    case "COMPLETE_REPORT": {
      const rep = state.reports.find((r) => r.id === action.payload);
      const pts = rep?.points ?? 0;
      const feed = {
        id: Date.now(),
        user: state.user.name,
        userAvatar: state.user.avatar,
        action: "почисти",
        place: rep?.location ?? "",
        pts: `+${pts}`,
        time: "сега",
        type: "clean",
      };
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload
            ? { ...r, status: "done", cleanedBy: state.user.name }
            : r,
        ),
        activityFeed: [feed, ...state.activityFeed],
        user: {
          ...state.user,
          points: state.user.points + pts,
          cleanings: state.user.cleanings + 1,
        },
      };
    }

    case "SPEND_POINTS":
      return {
        ...state,
        user: {
          ...state.user,
          points: Math.max(0, state.user.points - action.payload),
        },
      };

    case "SELECT_REPORT":
      return { ...state, selectedReportId: action.payload };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          { id: Date.now(), ...action.payload },
          ...state.notifications,
        ],
      };

    case "SET_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case "SET_REPORTS":
      return {
        ...state,
        reports: action.payload,
      };

    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [userData, reportData] = await Promise.all([
          usersApi.getMe(),
          reportsApi.list(),
        ]);
        if (userData) dispatch({ type: "SET_USER", payload: mapBackendUser(userData) });
        if (Array.isArray(reportData)) {
          dispatch({
            type: "SET_REPORTS",
            payload: reportData.map((r, idx) => mapBackendReport(r, idx)),
          });
        }
      } catch {
        // Keep mock state as fallback when backend is unreachable.
      }
    };
    loadInitialData();
  }, []);

  const addReport = useCallback(
    async (data) => {
      try {
        const payload = {
          latitude: data.gps?.lat ?? 42.6977,
          longitude: data.gps?.lng ?? 23.3219,
          photoUrl: data.photoUrl ?? null,
          description: data.description,
        };
        const created = await reportsApi.create(state.user.id, payload);
        const mapped = mapBackendReport(created, 1);
        dispatch({ type: "ADD_REPORT", payload: mapped });
      } catch {
        dispatch({ type: "ADD_REPORT", payload: data });
      }
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          type: "success",
          message: "📍 Сигналът е изпратен! +15 точки",
          duration: 3500,
        },
      });
    },
    [state.user.id],
  );

  const claimReport = useCallback(
    async (id) => {
      try {
        await tasksApi.create(state.user.id, id);
        await reportsApi.updateStatus(id, "IN_PROGRESS");
      } catch {
        // Fall back to local optimistic state.
      }
      dispatch({ type: "CLAIM_REPORT", payload: id });
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          type: "info",
          message: "🧹 Взел си задачата — успех!",
          duration: 3000,
        },
      });
    },
    [state.user.id],
  );

  const completeReport = useCallback(
    async (id) => {
      const rep = state.reports.find((r) => r.id === id);
      try {
        await reportsApi.updateStatus(id, "CLEANED");
      } catch {
        // Fall back to local optimistic state.
      }
      dispatch({ type: "COMPLETE_REPORT", payload: id });
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          type: "success",
          message: `🎉 Почистено! +${rep?.points ?? 0} точки`,
          duration: 4000,
        },
      });
    },
    [state.reports],
  );

  const selectReport = useCallback(
    (id) => dispatch({ type: "SELECT_REPORT", payload: id }),
    [],
  );
  const dismissNotification = useCallback(
    (id) => dispatch({ type: "DISMISS_NOTIFICATION", payload: id }),
    [],
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        addReport,
        claimReport,
        completeReport,
        selectReport,
        dismissNotification,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
