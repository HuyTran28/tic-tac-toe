export default function ScoreBoard({ wins, losses, draws, currentWinStreak }) {
    return (
        <>
            <div>Win: {wins}</div>
            <div>Loss: {losses}</div>
            <div>Draw: {draws}</div>
            <div>Current Win Streak: {currentWinStreak}</div>
        </>
    )
}