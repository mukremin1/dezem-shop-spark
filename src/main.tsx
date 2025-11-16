import { createRoot } from "react-dom/client";
// import the named export to avoid default-export detection issues
import { App } from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
