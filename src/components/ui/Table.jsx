import React from "react";

const Table = ({ header, rows }) => {
  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full text-left rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gradient-to-r from-red-600 to-orange-700 text-white">
          <tr>{header}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default Table;
