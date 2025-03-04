

let playerTurn = true;

function minimax(board, depth, isMaximizing) {
    // Check if there's a winner
    const winner = checkWinnerForMinimax(board);
    
    if (winner === computerSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    
    // Check for a tie
    if (!board.includes('')) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove = null;
    

    // Create a copy of the current board state
    let boardArray = Array(9).fill('');
    cells.forEach((cell, index) => {
        boardArray[index] = cell.textContent;
    });

    // Find the best move
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i] === '') {
            boardArray[i] = computerSymbol;
            let score = minimax(boardArray, 0, false);
            boardArray[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        let selectedCell = cells[bestMove];
        selectedCell.textContent = computerSymbol;

        if (checkForWinner()) return;

        switchTurn();
    }

    playerTurn = true;
}

function handleMove(cell) {
    if(!playerTurn || cell.textContent !== '') return;

    if(cell.textContent === '') {
        cell.textContent = currentPlayer;

        if (checkForWinner()) return;

    }

    playerTurn = false;

    switchTurn();

    if(currentPlayer === computerSymbol) {
        setTimeout(computerMove, 500);
    }
}

function assignFirstTurn() {
    if(playerSymbol === 'X') {
        // the first turn will be of player
        currentPlayer = playerSymbol;
    } else {
        currentPlayer = computerSymbol;
        setTimeout(computerMove, 500);
        // the first turn will be of computer
    }
}

function checkWinnerForMinimax(board) {
    const winningCombinations = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let combination of winningCombinations) {
        let [a, b, c] = combination;

        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    
    return null;
}