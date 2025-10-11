import styles from './Board.module.css'
import Square from './Square'

export default function Board({ board = [], handleClick, winnerCombination = [] }) {
    const count = 9
    const squares = Array.from({ length: count })

    return (
        <div className={styles.board}>
            {squares.map((_, i) => (
                <Square 
                    key={i} 
                    value={board[i]} 
                    handleClick={event => handleClick(i)} 
                    isWinner={winnerCombination.includes(i)}
                />
            ))}            
        </div>
    )
}