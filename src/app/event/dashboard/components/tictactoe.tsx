"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { X, Circle } from 'lucide-react'

const TicTacToe = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null)

  useEffect(() => {
    if (winner && winner !== "Draw") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [winner])

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? "X" : "O"
    setBoard(newBoard)
    setIsXNext(!isXNext)

    checkWinner(newBoard)
  }

  const checkWinner = (board: (string | null)[]) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a])
        setWinningCombination(combo)
        return
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setIsXNext(true)
    setWinningCombination(null)
  }

  const getCellSymbol = (value: string | null) => {
    if (value === "X") return <X className="w-8 h-8 text-blue-500" />
    if (value === "O") return <Circle className="w-8 h-8 text-red-500" />
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="game-container p-8 bg-white rounded-xl shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Tic-Tac-Toe</h2>

        {winner && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-semibold mb-6 text-center"
          >
            {winner === "Draw" ? (
              <span className="text-yellow-500">It&apos;s a Draw!</span>
            ) : (
              <span className={winner === "X" ? "text-blue-500" : "text-red-500"}>
                {winner} Wins!
              </span>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-md focus:outline-none transition-colors duration-300 ${
                cell
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-100"
              } ${
                winningCombination?.includes(index)
                  ? "bg-green-200"
                  : "bg-gray-200"
              }`}
            >
              {getCellSymbol(cell)}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-md focus:outline-none transition-colors duration-300"
        >
          Reset Game
        </motion.button>
      </motion.div>
    </div>
  )
}

export default TicTacToe

