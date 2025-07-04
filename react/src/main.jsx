import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.jsx";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
