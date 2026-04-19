import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import { CURRENT_USER, REPORTS, ACTIVITY_FEED } from "../data/mockData.ts";

interface Report {
  id: number;
  title: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  status: string;
  severity: string;
  img: string;
  points: number;
  reporter: string;
  reporterAvatar: string;
  time: string;
  description: string;
  volunteers: number;
  confirmedBy: string[];
  aiVerified: boolean;
  gps: { lat: number; lng: number };
  claimedBy?: string;
  cleanedBy?: string;
  photoUrl?: string | null;
}

interface FeedItem {
  id: number;
  user: string;
  userAvatar: string;
  action: string;
  place: string;
  pts: string;
  time: string;
  type: string;
}

type User = typeof CURRENT_USER;

interface Notification {
  id: number;
  type?: string;
  message: string;
  duration?: number;
}

interface AppState {
  user: User;
  reports: Report[];
  activityFeed: FeedItem[];
  notifications: Notification[];
  selectedReportId: number | null;
}

type Action =
  | { type: "ADD_REPORT"; payload: Record<string, unknown> }
  | { type: "CLAIM_REPORT"; payload: number }
  | { type: "COMPLETE_REPORT"; payload: number }
  | { type: "SPEND_POINTS"; payload: number }
  | { type: "SELECT_REPORT"; payload: number | null }
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id"> }
  | { type: "DISMISS_NOTIFICATION"; payload: number };

const POINTS_BY_SEVERITY: Record<string, number> = { critical: 200, high: 120, medium: 80, low: 40 };

const initialState: AppState = {
  user: CURRENT_USER,
  reports: REPORTS as Report[],
  activityFeed: ACTIVITY_FEED,
  notifications: [],
  selectedReportId: null,
};

const POINTS_BY_SEVERITY: Record<string, number> = { critical: 200, high: 120, medium: 80, low: 40 };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_REPORT": {
      const p = action.payload as Record<string, any>;
      const sev = (p.severity as string) ?? "medium";
      const r: Report = {
        id: (p.reportId ?? p.id ?? state.reports.length + 1) as number,
        title: (p.title ?? (p.description ? (p.description as string).slice(0, 40) : "New report")) as string,
        location: (p.location ?? `${(p.latitude as number)?.toFixed(4)}°N, ${(p.longitude as number)?.toFixed(4)}°E`) as string,
        description: (p.description ?? "") as string,
        severity: sev,
        status: "open",
        img: (p.img ?? "map-pin") as string,
        points: POINTS_BY_SEVERITY[sev] ?? 80,
        reporter: state.user.name,
        reporterAvatar: state.user.avatar,
        time: "just now",
        volunteers: 0,
        confirmedBy: [],
        aiVerified: true,
        district: (p.district ?? "Sofia") as string,
        gps: (p.gps ?? { lat: p.latitude, lng: p.longitude }) as { lat: number; lng: number },
        lat: p.latitude as number,
        lng: p.longitude as number,
        photoUrl: (p.photoUrl ?? null) as string | null,
      };
      const feed: FeedItem = {
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
      const feed: FeedItem = {
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

const AppContext = createContext<any>(null);

export function AppProvider({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addReport = useCallback((data: Record<string, unknown>) => {
    dispatch({ type: "ADD_REPORT", payload: data });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "success",
        message: "Сигналът е изпратен! +15 точки",
        duration: 3500,
      },
    });
  }, []);

  const claimReport = useCallback((id: number) => {
    dispatch({ type: "CLAIM_REPORT", payload: id });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "info",
        message: "Взел си задачата — успех!",
        duration: 3000,
      },
    });
  }, []);

  const completeReport = useCallback((id: any) => {
    const rep = reportsRef.current.find((r: any) => r.id === id);
    dispatch({ type: "COMPLETE_REPORT", payload: id });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "success",
        message: `Почистено! +${rep?.points ?? 0} точки`,
        duration: 4000,
      },
    });
  }, []);

  const selectReport = useCallback(
    (id: number | null) => dispatch({ type: "SELECT_REPORT", payload: id }),
    [],
  );
  const dismissNotification = useCallback(
    (id: number) => dispatch({ type: "DISMISS_NOTIFICATION", payload: id }),
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
        logout: onLogout,
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
