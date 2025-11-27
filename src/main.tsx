import './styles/theme.css';
import { createRoot } from "react-dom/client";
// App.tsx içinde export const App bulunduğu için named import kullanıyoruz
import { App } from "./App.tsx";
import "./index.css";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuth";

createRoot(document.getElementById("root")!).render(<SupabaseAuthProvider><App /></SupabaseAuthProvider>);

