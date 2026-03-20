import { createContext, useContext, useReducer, useCallback } from "react";
import { CURRENT_USER, REPORTS, ACTIVITY_FEED } from "../data/mockData.js";

const initialState = {
  user: CURRENT_USER,
  reports: REPORTS,
  activityFeed: ACTIVITY_FEED,
  notifications: [],
  selectedReportId: null,
};

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

  const addReport = useCallback((data) => {
    dispatch({ type: "ADD_REPORT", payload: data });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "success",
        message: "📍 Сигналът е изпратен! +15 точки",
        duration: 3500,
      },
    });
  }, []);

  const claimReport = useCallback((id) => {
    dispatch({ type: "CLAIM_REPORT", payload: id });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        type: "info",
        message: "🧹 Взел си задачата — успех!",
        duration: 3000,
      },
    });
  }, []);

  const completeReport = useCallback(
    (id) => {
      const rep = state.reports.find((r) => r.id === id);
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
