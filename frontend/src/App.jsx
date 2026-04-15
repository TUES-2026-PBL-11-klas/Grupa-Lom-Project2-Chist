import { useState } from "react";
import { AppProvider } from "./context/AppContext.jsx";
import AuthView from "./pages/AuthView.jsx";
import Main from "./Main.jsx";

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem("cw_token")),
  );
  if (!authenticated) {
    return <AuthView onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
