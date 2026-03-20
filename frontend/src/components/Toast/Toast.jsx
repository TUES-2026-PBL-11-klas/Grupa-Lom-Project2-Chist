import { useEffect } from "react";
import "./Toast.css";
import { useApp } from "../../context/AppContext.jsx";

function SingleToast({ notif }) {
  const { dismissNotification } = useApp();
  useEffect(() => {
    if (!notif.duration) return;
    const t = setTimeout(() => dismissNotification(notif.id), notif.duration);
    return () => clearTimeout(t);
  }, [notif.id, notif.duration, dismissNotification]);

  return (
    <div
      className={`toast toast--${notif.type || "info"}`}
      onClick={() => dismissNotification(notif.id)}
      role="alert"
    >
      {notif.message}
    </div>
  );
}

export default function Toast() {
  const { notifications } = useApp();
  if (!notifications.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {notifications.slice(0, 3).map((n) => (
        <SingleToast key={n.id} notif={n} />
      ))}
    </div>
  );
}
