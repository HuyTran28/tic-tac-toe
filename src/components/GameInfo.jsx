import styles from "./GameInfo.module.css"
import ToggleMode from "./ToggleMode"

export default function GameInfo({ winner, resetGame, mode, setMode, 
                                    xIsNext, totalPosNum, durationMs }) {    
    return (
        <>
            {winner ? 
                <div>{winner !== "Draw" ? `Winner ${winner}` : "Draw"}</div> : 
                <div>Next player: {xIsNext ? "X" : "O"}</div>}
            {mode === "hard" &&
                <>
                    <div>Total positions evaluated: {totalPosNum}</div>
                    <div>Duration: {durationMs}ms</div>
                </>
            }
            <button className={styles.button} onClick={() => resetGame()}>Reset</button>
            <ToggleMode mode={mode} setMode={setMode} />
        </>
    )
}