import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import OrganizationWallets from "./pages/OrganizationWallets";
import WalletInformation from "./pages/WalletInformation";

export default function App() {
  const turnkeyConfig = {
    apiBaseUrl: "https://api.turnkey.com",
    // prefix with NEXT_PUBLIC for NextJS
    defaultOrganizationId: "ceddd4dd-272e-4e38-bd79-40401694ccef",
    // your application's domain
    // rpId: "http://localhost:3000/",
    iframeUrl: "https://auth.turnkey.com",
    // The URL that the Turnkey SDK will send requests to for signing operations.
    // This should be a backend endpoint that your application controls.
    serverSignUrl: "https://f2a9-103-200-100-102.ngrok-free.app/email-auth",
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <TurnkeyProvider config={turnkeyConfig}>
                <Home />
              </TurnkeyProvider>
            }
          />
          <Route
            path="/dashboard"
            element={
              <TurnkeyProvider config={turnkeyConfig}>
                <Dashboard />{" "}
              </TurnkeyProvider>
            }
          />
          <Route
            path="/dashboard/:id"
            element={
              <TurnkeyProvider config={turnkeyConfig}>
                <OrganizationWallets />{" "}
              </TurnkeyProvider>
            }
          />
          <Route
            path="/dashboard/:id/wallet/:walletId"
            element={
              <TurnkeyProvider config={turnkeyConfig}>
                <WalletInformation />{" "}
              </TurnkeyProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
