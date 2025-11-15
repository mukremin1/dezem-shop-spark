import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dezemu Shop</h1>
      <input
        type="text"
        placeholder="Search products..."
        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </header>
  );
};

export default Header;
