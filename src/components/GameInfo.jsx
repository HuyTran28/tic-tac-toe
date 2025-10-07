import { useEffect, useState } from "react";
import Board from "./Board";
import { findBestMove } from "../utils/ai";
import { calculateWinner } from "../utils/gameLogic";

export default function GameInfo() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const gameWinner = calculateWinner(board)
        setWinner(gameWinner)
    }, [board])

    useEffect(() => {
        if (xIsNext || winner) return;

        const bestMove = findBestMove(board);
        if (bestMove !== null) {
            const newBoard = board.slice();
            newBoard[bestMove] = "O"; // AI move
            setBoard(newBoard);
            setXIsNext(true);
        }
    }, [xIsNext])

    const handleClick = (index) => {
        // State is an array must create new array
        if (board[index] || winner) {
            return
        }

        const newBoard = board.slice();
        newBoard[index] = "X";
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }
    
    return (
        <>
            {winner && <div>{winner !== "Draw" ? `Winner ${winner}` : "Draw"}</div>}
            <Board board={board} handleClick={handleClick}/>
        </>
    )
}