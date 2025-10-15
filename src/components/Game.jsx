import { use, useEffect, useState, useRef } from "react";
import Board from "./Board";
import { getNextMove } from "../utils/gameLogic";
import { calculateWinner } from "../utils/gameLogic";
import GameInfo from "./GameInfo";
import ScoreBoard from "./ScoreBoard";
import styles from './Game.module.css'; // Add this import

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
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [winner, setWinner] = useState(null);
    const [winnerCombination, setWinnerCombination] = useState([]);
    // const [mode, setMode] = useState("easy"); // easy, hard
    const wsRef = useRef(null);
    const playerRef = useRef(null);

    const [totalPosNum, setTotalPosNum] = useState(0);
    const [durationMs, setDurationMs] = useState(0);

    const [{ wins, losses, draws, currentWinStreak }, setScore] = useState(getInitialScore());

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({   
                type: 'join',
            }));        
        }

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            switch (type) {
                case 'start':
                    playerRef.current = data.player;
                    setIsPlayerTurn(data.player === 'X');
                    break;
                case 'display':
                    setBoard(data.board);
                    setIsPlayerTurn(data.nextPlayer === playerRef.current);
                    break;
                default:
                    break;
            }
        }

        return () => {
            ws.close();
            wsRef.current = null;
        }
    }, [])

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
        const {winner, combination} = calculateWinner(board)
        setWinner(winner);
        setWinnerCombination(combination);
    }, [board])

    // useEffect(() => {
    //     if (xIsNext || winner) return;

    //     const {move, totalPosNum, durationMs} = getNextMove(mode, board);
    //     if (move !== null) {
    //         const newBoard = board.slice();
    //         newBoard[move] = "O"; // AI move
    //         setBoard(newBoard);
    //         setXIsNext(true);

    //         if (mode === "hard") {
    //             setTotalPosNum(totalPosNum);
    //             setDurationMs(durationMs);
    //         }
    //     }
    // }, [xIsNext])

    const chooseSquare = (index) => {
        // State is an array must create new array
        if (board[index] || winner || !isPlayerTurn) {
            return
        }

        board[index] = playerRef.current;
        setBoard([...board]);

        wsRef.current.send(JSON.stringify({
            type: 'move', 
            data: {
                board: board,
                nextPlayer: playerRef.current === 'X' ? 'O' : 'X'
            }
        }))

        // setXIsNext(!xIsNext);
    }

    const resetGame = () => {
        const newBoard = Array(9).fill(null)
        setBoard(newBoard)
        setWinner(null)
        // setXIsNext(true)
        setTotalPosNum(0)
        setDurationMs(0)
    }
    
    return (
        <>
            <div className={styles.gameContainer}>
                <Board 
                    board={board} 
                    handleClick={chooseSquare} 
                    winnerCombination={winnerCombination}
                />
                <ScoreBoard 
                    wins={wins} 
                    losses={losses} 
                    draws={draws} 
                    currentWinStreak={currentWinStreak} 
                />
            </div>
            <GameInfo 
                winner={winner} 
                resetGame={resetGame} 
                isPlayerTurn={isPlayerTurn}
                totalPosNum={totalPosNum}
                durationMs={durationMs}    
            />
        </>
    )
}