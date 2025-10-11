import { calculateWinner } from "./gameLogic";

const minimax = (board, depth, isMaximizing, alpha=-Infinity, beta=Infinity) => {
    const {winner, combination} = calculateWinner(board);
    
    // AI is "O", Human is "X"
    if (winner) {
        let score = 0;
        if (winner === "X") score = depth - 10;
        else if (winner === "O") score = 10 - depth;
        return {score, posNum: 1};
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        let totalPosNum = 0;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                const newBoard = [...board];
                newBoard[i] = "O"; // AI move
                const {score, posNum} = minimax(newBoard, depth + 1, false, alpha, beta);
                
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score)
                totalPosNum += posNum;

                if (alpha >= beta) break
            }
        }
        return {score: bestScore, posNum: totalPosNum};
    } else {
        let bestScore = Infinity;
        let totalPosNum = 0;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                const newBoard = [...board];
                newBoard[i] = "X"; // Human move
                const {score, posNum} = minimax(newBoard, depth + 1, true, alpha, beta);

                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score)
                totalPosNum += posNum;

                if (alpha >= beta) break
            }
        }
        return {score: bestScore, posNum: totalPosNum};
    }
}

const findBestMove = (board) => {
    const start = performance.now();

    let bestScore = -Infinity;
    let move = null;
    let totalPosNum = 0;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            const newBoard = [...board];
            newBoard[i] = "O"; // AI move
            
            const {score, posNum} = minimax(newBoard, 0, false);
            totalPosNum += posNum;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    const durationMs = performance.now() - start;
    return {move, totalPosNum, durationMs};
}

export {findBestMove}