import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import AuthView from "./components/AuthView.jsx";
import main from "./main.jsx";

export default function App() {
  // In production: check localStorage for a valid JWT token on mount
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AuthView onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <main />
    </AppProvider>
  );
}
