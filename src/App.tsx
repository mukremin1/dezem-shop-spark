import React from "react";
import Header from "@/components/Header";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4">
        <h2 className="text-2xl font-semibold">Welcome to Dezemu Shop!</h2>
        <p className="mt-2 text-gray-600">Explore our amazing products.</p>
      </main>
    </div>
  );
};

export default App;
