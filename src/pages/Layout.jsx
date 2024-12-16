import React from "react";
import { Outlet } from "react-router-dom";
import "../index.css";

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-red-950 text-gray-100">
      <header className="fixed top-0 left-0 w-full p-6 z-10 bg-gradient-to-br from-gray-900 to-red-950">
        <div className="container mx-auto flex items-center">
          <h1 className="text-xl font-bold text-red-300">TurnX</h1>
        </div>
      </header>
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
