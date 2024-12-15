export const Input = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white"
    />
  );
};
