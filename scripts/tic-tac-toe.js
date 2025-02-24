const board = document.querySelector('.board');
let cells; // This will be updated when board is initialized
const restartButton = document.querySelector('.js-restart-button');
let playerSymbol;
let computerSymbol;

let currentPlayer;

function initializeBoard() {
    if (!board) {
        console.error('Error: Board element not found!');
        return;
    }

    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement('button');
        cell.classList.add('cell');
        cell.dataset.index = i;
        board.appendChild(cell);
    }

    // Update cells reference after creating new cells
    cells = document.querySelectorAll('.cell');
    
    currentPlayer = localStorage.getItem('playerChoice') || 'X';

    setUpEventListeners();

    board.classList.remove('hidden'); // Show board
    board.classList.add('board');
    restartButton.classList.remove('hidden'); // Show restart button
    restartButton.classList.add('restart-button');
}

function setUpEventListeners() {
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleMove(cell));
    });
}

function handleMove(cell) {
    if(cell.textContent !== '') return;

    cell.textContent = currentPlayer;

    if (checkForWinner()) return;

    switchTurn();

    if(currentPlayer === computerSymbol) {
        setTimeout(computerMove, 500);
    }
}

function switchTurn() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

function startGame() {
    let startGameButton = document.querySelector('.js-start-button');
    
    restartButton.classList.remove('restart-button');

    startGameButton.addEventListener('click', () => {
        startGameButton.classList.add('hidden');
        startGameButton.classList.remove('start-button');
        board.classList.remove('board');
        playerChoice();
    });
}

function resetGame(){ 
    restartButton.removeEventListener('click', initializeBoard);
    restartButton.addEventListener('click', () => {
        initializeBoard();
        displayMessage('');
    }); 
}

function playerChoice() {
    let container = document.querySelector('.js-choose-container');

    let html = `
        <p class="ask-player">Choose Between X or O</p>
        <button class="x-button js-x-button">X</button>
        <button class="o-button js-o-button">O</button>
    `;

    container.innerHTML = html;
    container.classList.remove('hidden');

    let xButton = document.querySelector('.js-x-button');
    let oButton = document.querySelector('.js-o-button');

    function handleChoice(choice) {
        playerSymbol = choice;
        computerSymbol = (choice === 'X') ? 'O' : 'X';

        localStorage.setItem('playerChoice', playerSymbol);
        container.classList.add('hidden');
        initializeBoard();
    }

    xButton.addEventListener('click', () => handleChoice('X'));
    oButton.addEventListener('click', () => handleChoice('O'));
}

// This is our UI checker - shows messages and disables board
function checkForWinner() {
    const winner = getWinner();
    
    if (winner) {
        displayMessage(`winner is ${winner}`);
        disableBoard();
        return true;
    }

    let isDraw = [...cells].every(cell => cell.textContent !== '');
    if (isDraw) {
        displayMessage(`It is a draw`);
        disableBoard();
        return true;
    }
    
    return false;
}

// This is our logical checker - returns the winner symbol or null
function getWinner() {
    const winningCombinations = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let combination of winningCombinations) {
        let [a, b, c] = combination;

        let cellA = cells[a].textContent;
        let cellB = cells[b].textContent;
        let cellC = cells[c].textContent;

        if (cellA !== '' && cellA === cellB && cellB === cellC) {
            return cellA;
        }
    }
    
    return null;
}

function displayMessage(message) {
    let messageContainer = document.querySelector('.message-container');

    if(!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        document.body.appendChild(messageContainer);
    }

    messageContainer.textContent = message; 
}

function disableBoard() {
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

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
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    resetGame();
});