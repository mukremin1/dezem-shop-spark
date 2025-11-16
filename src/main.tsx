import React from "react";
import ReactDOM from "react-dom/client";
// explicit .tsx extension can help dependency scanner in some setups
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
