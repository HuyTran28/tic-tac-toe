import { use, useEffect, useState } from "react";
import Board from "./Board";
import { getNextMove } from "../utils/gameLogic";
import { calculateWinner } from "../utils/gameLogic";
import GameInfo from "./GameInfo";
import ScoreBoard from "./ScoreBoard";

const SCORE_KEY = "scoreboard";

function getInitialScore() {
    const savedScore = localStorage.getItem(SCORE_KEY);
    if (savedScore) {
        return JSON.parse(savedScore);
    }
    return {
        wins: 0,
        losses: 0,
        draws: 0,
        currentWinStreak: 0
    };
}

export default function Game() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [mode, setMode] = useState("easy"); // easy, hard
    
    const [totalPosNum, setTotalPosNum] = useState(0);
    const [durationMs, setDurationMs] = useState(0);

    const [{ wins, losses, draws, currentWinStreak }, setScore] = useState(getInitialScore());

    useEffect(() => {
        localStorage.setItem(SCORE_KEY, JSON.stringify({ wins, losses, draws, currentWinStreak }));
    }, [wins, losses, draws, currentWinStreak]);

    useEffect(() => {
        if (!winner) return;

        if (winner === "X") {
            setScore(preScore => ({
                ...preScore,
                wins: preScore.wins + 1,
                currentWinStreak: preScore.currentWinStreak + 1
            }));
        } else if (winner === "O") {
            setScore(preScore => ({
                ...preScore,
                losses: preScore.losses + 1,
                currentWinStreak: 0
            }));
        } else {
            setScore(preScore => ({
                ...preScore,
                draws: preScore.draws + 1,
                currentWinStreak: 0
            }));
        }
    }, [winner])

    useEffect(() => {
        const gameWinner = calculateWinner(board)
        setWinner(gameWinner);
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
        setWinner(null)
        setXIsNext(true)
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
            <ScoreBoard 
                wins={wins} 
                losses={losses} 
                draws={draws} 
                currentWinStreak={currentWinStreak} 
            />
        </>
    )
}