import React from "react";

const Card = ({ title, description, icon }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-52 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-lg"></div>
      <div className="relative flex flex-col items-center gap-4 p-6">
        <div className="text-5xl text-purple-300">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 text-center">{description}</p>
      </div>
    </div>
  );
};

export default Card;
