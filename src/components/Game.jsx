import { useEffect, useState } from "react";
import Board from "./Board";
import { getNextMove } from "../utils/gameLogic";
import { calculateWinner } from "../utils/gameLogic";
import GameInfo from "./GameInfo";

export default function Game() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [mode, setMode] = useState("easy"); // easy, hard
    const [totalPosNum, setTotalPosNum] = useState(0);
    const [durationMs, setDurationMs] = useState(0);

    useEffect(() => {
        const gameWinner = calculateWinner(board)
        setWinner(gameWinner)
    }, [board])

    useEffect(() => {
        if (xIsNext || winner) return;

        const {move, totalPosNum, durationMs} = getNextMove(mode, board);
        if (move !== null) {
            const newBoard = board.slice();
            newBoard[move] = "O"; // AI move
            setBoard(newBoard);
            setXIsNext(true);

            if (mode === "hard") {
                setTotalPosNum(totalPosNum);
                setDurationMs(durationMs);
            }
        }
    }, [xIsNext])

    const chooseSquare = (index) => {
        // State is an array must create new array
        if (board[index] || winner) {
            return
        }

        const newBoard = board.slice();
        newBoard[index] = "X";
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }

    const resetGame = () => {
        const newBoard = Array(9).fill(null)
        setBoard(newBoard)
    }
    
    return (
        <>
            <Board board={board} handleClick={chooseSquare} />
            <GameInfo 
                winner={winner} 
                resetGame={resetGame} 
                mode={mode} 
                setMode={setMode} 
                xIsNext={xIsNext}
                totalPosNum={totalPosNum}
                durationMs={durationMs}    
            />
        </>
    )
}