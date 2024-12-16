import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import OrganizationWallets from "./pages/OrganizationWallets";
import WalletInformation from "./pages/WalletInformation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY;
const DEFAULT_ORGANIZATION = import.meta.env.VITE_DEFAULT_ORGANIZATION_ID;

export default function App() {
  const turnkeyConfig = {
    apiBaseUrl: API_BASE_KEY,
    // prefix with NEXT_PUBLIC for NextJS
    defaultOrganizationId: DEFAULT_ORGANIZATION,
    // your application's domain
    // rpId: "http://localhost:3000/",
    iframeUrl: API_BASE_KEY,
    // The URL that the Turnkey SDK will send requests to for signing operations.
    // This should be a backend endpoint that your application controls.
    serverSignUrl: BACKEND_URL + "/v2/otp/email-auth",
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                  <Dashboard />
                </TurnkeyProvider>
              }
            />
            <Route
              path="/dashboard/:id"
              element={
                <TurnkeyProvider config={turnkeyConfig}>
                  <OrganizationWallets />
                </TurnkeyProvider>
              }
            />
            <Route
              path="/dashboard/:id/wallet/:walletId"
              element={
                <TurnkeyProvider config={turnkeyConfig}>
                  <WalletInformation />
                </TurnkeyProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
