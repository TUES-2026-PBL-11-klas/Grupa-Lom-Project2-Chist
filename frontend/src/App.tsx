import { useState } from "react";
import { AppProvider } from "./context/AppContext.tsx";
import AuthView from "./pages/AuthView.tsx";
import Main from "./Main.tsx";

export default function App() {
  const [authenticated, setAuthenticated] = useState(true); // need injection from backend
  if (!authenticated) {
    return <AuthView onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
