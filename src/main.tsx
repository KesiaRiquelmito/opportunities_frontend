import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "react-redux";
import "@/styles/globals.css";
import { store } from "@/store";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <HeroUIProvider locale="es-ES">
        <App />
        </HeroUIProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
