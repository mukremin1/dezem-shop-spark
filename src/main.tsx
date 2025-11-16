import React from "react";
import ReactDOM from "react-dom/client";
// import the named export to avoid default-export detection issues
import { App } from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
