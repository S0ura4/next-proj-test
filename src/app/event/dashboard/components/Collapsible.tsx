import React, { useState } from "react";
import TicTacToe from "./tictactoe";

const Collapsible = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-container">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 bg-gray-600 rounded-md w-full"
      >
        {isOpen ? "Close Game Play" : "Open Game Play"}
      </button>
      {isOpen && (
        <div className="gameplay-content mt-4 bg-gray-800 p-4 rounded-md">
          <TicTacToe /> {/* Embed the TicTacToe component here */}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
