import { useState } from "react";
import { AppProvider } from "./context/AppContext.jsx";
import AuthView from "./components/AuthView/AuthView.jsx";
import Main from "./Main.jsx";

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
