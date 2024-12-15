"use client";
import React from "react";

export default function Box({ children }) {
  return (
    <div className="group relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-300 w-full">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-lg transition-opacity duration-500"></div>
      <div className="relative flex flex-col items-center gap-4 p-6 w-full">
        {children}
      </div>
    </div>
  );
}
