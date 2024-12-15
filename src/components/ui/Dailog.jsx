"use client";

import React from "react";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="bg-white dark:bg-gray-800 mx-8 my-10">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
