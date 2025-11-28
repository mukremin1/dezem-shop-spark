import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// App.tsx içinde export const App bulunduğu için named import kullanıyoruz
import { App } from "./App.tsx";
import "./index.css";

// Basit bir router ile App'i sarmalayıp React Router'ın v7 future flag'ine opt‑in yapıyoruz.
// Eğer uygulamanız zaten kendi içinde Router kullanıyorsa (ör. App içinde BrowserRouter) bu değişikliği
// uygulamadan önce App içeriğini kontrol edin.
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    // İsterseniz burada ek route'lar tanımlayabilirsiniz.
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
