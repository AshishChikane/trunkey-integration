"use client";

const Button = ({ label, onClick, variant = "primary" }) => {
  const baseStyles =
    "px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-red-600 to-orange-950 text-white hover:shadow-lg transform hover:scale-105",
    secondary:
      "bg-gray-700 text-white hover:bg-gray-800 border-transparent border-2",
    outline:
      "border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
      style={{ transformOrigin: "center" }}
    >
      {label}
    </button>
  );
};

export default Button;
