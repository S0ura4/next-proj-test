import React from "react";
import PrivateChat from "../private/PrivateChat"; // Private chat component
import TicTacToe from "../private/tictactoe";

interface CollapsibleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="collapsible-container w-full h-full">
      {!isOpen ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="text-white p-2 bg-gray-600 rounded-md w-full"
          >
            Maximize
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full bg-gray-800">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white p-2 bg-gray-600 rounded-md mb-4 self-center w-1/4"
          >
            Minimize
          </button>
          <div className="flex flex-row flex-1 space-x-4 p-4">
            {/* Private Chat */}
            <div className="flex-1 bg-gray-900 rounded-md p-4 overflow-auto">
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                Private Chat
              </h2>
              <PrivateChat />
            </div>
            {/* Tic Tac Toe */}
            <div className="flex-1 bg-gray-900 rounded-md p-4 overflow-auto">
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                Tic Tac Toe
              </h2>
              <TicTacToe />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collapsible;
