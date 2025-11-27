import "./global-shim"; // si ya lo tienes
import "mathlive/fonts.css"; // 👈 NUEVO: carga las fuentes correctamente

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
