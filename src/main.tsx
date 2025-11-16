import { createRoot } from "react-dom/client";
// App is exported as a named export in src/App.tsx
import { App } from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
