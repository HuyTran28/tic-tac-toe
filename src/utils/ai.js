import { calculateWinner } from "./gameLogic";

const minimax = (board, depth, isMaximizing, alpha=-Infinity, beta=Infinity) => {
    const winner = calculateWinner(board);

    // AI is "O", Human is "X"
    if (winner) {
        if (winner === "X") return depth - 10;
        else if (winner === "O") return 10 - depth;
        else return 0; // Draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                const newBoard = [...board];
                newBoard[i] = "O"; // AI move
                const score = minimax(newBoard, depth + 1, false, alpha, beta);
                
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score)

                if (alpha >= beta) break
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                const newBoard = [...board];
                newBoard[i] = "X"; // Human move
                const score = minimax(newBoard, depth + 1, true, alpha, beta);

                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score)

                if (alpha >= beta) break
            }
        }
        return bestScore;
    }
}

const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            const newBoard = [...board];
            newBoard[i] = "O"; // AI move
            const score = minimax(newBoard, 0, false);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

export {findBestMove}