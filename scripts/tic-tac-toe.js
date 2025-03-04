const board = document.querySelector('.board');
let cells; // This will be updated when board is initialized
const restartButton = document.querySelector('.js-restart-button');
const startGameButton = document.querySelector('.js-start-button');
const biListButton = document.querySelector('.bi-list');

let player1Symbol;
let player2Symbol;

let currentPlayer;

let player1Score = 0;
let player2Score = 0;
let tiesScore = 0;

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

    initializeScoreBoard();

    // Update cells reference after creating new cells
    cells = document.querySelectorAll('.cell');
    
    // Use player1Symbol as initial player instead of from localStorage
    currentPlayer = player1Symbol || 'X';

    // Remove any existing event listeners
    cells.forEach(cell => {
        cell.replaceWith(cell.cloneNode(true));
    });
    
    // Get updated references and add new listeners
    cells = document.querySelectorAll('.cell');
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

    if(checkForWinner()) return;
    
    switchTurn();
}

function switchTurn() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

function startGame() {
    restartButton.classList.remove('restart-button');
    restartButton.classList.add('hidden');

    // Remove any existing event listeners to prevent duplicates
    startGameButton.replaceWith(startGameButton.cloneNode(true));

    // Get updated reference
    const newStartButton = document.querySelector('.js-start-button');
    
    newStartButton.addEventListener('click', () => {
        newStartButton.classList.add('hidden');
        newStartButton.classList.remove('start-button');
        board.classList.remove('board');
        playerChoice();
    });
}

function resetGame(){ 
    restartButton.removeEventListener('click', initializeBoard);
    restartButton.addEventListener('click', () => {
        initializeBoard();
    }); 
}



function playerChoice() {
    let container = document.querySelector('.js-choose-container');
    if (!container) {
        console.error('Error: Player choice container not found!');
        return;
    }

    let html = `
        <p class="ask-player">Choose Between X or O</p>
        <button class="x-button js-x-button">X</button>
        <button class="o-button js-o-button">O</button>
    `;

    container.innerHTML = html;
    container.classList.remove('hidden');

    let xButton = document.querySelector('.js-x-button');
    let oButton = document.querySelector('.js-o-button');

    // Remove any existing listeners
    if (xButton) xButton.replaceWith(xButton.cloneNode(true));
    if (oButton) oButton.replaceWith(oButton.cloneNode(true));
    
    // Get updated references
    xButton = document.querySelector('.js-x-button');
    oButton = document.querySelector('.js-o-button');

    function handleChoice(choice) {
        player1Symbol = choice;
        player2Symbol = (choice === 'X') ? 'O' : 'X';

        container.classList.add('hidden');
        initializeBoard();
    }

    if (xButton) xButton.addEventListener('click', () => handleChoice('X'));
    if (oButton) oButton.addEventListener('click', () => handleChoice('O'));
}

function initializeScoreBoard() {
    let scoreBoardContainer = document.querySelector('.score-board-container');

    if(scoreBoardContainer) {
        let player1Label = document.querySelector('.player-1-score .score-label');
        let player2Label = document.querySelector('.player-2-score .score-label');

        if(player1Label && player2Label) {
            player1Label.textContent = `Player (${player1Symbol || 'X'})`;
            player2Label.textContent = `Player (${player2Symbol || 'O'})`;
        }
        return;
    }

    scoreBoardContainer = document.createElement('div');
    scoreBoardContainer.classList.add('score-board-container');

    scoreBoardContainer.innerHTML = `
        <div class="player-1-score">
            <span class="score-label">Player (${player1Symbol || 'X'})</span>
            <span class="score-value" id="player-1-score">0</span>
        </div>
        <div class="ties">
            <span class="score-label">Ties</span>
            <span class="score-value" id="ties-score">0</span>
        </div>
        <div class="player-2-score">
            <span class="score-label">Player (${player2Symbol || 'O'})</span>
            <span class="score-value" id="player-2-score">0</span>
        </div>`;

    if(board && board.parentNode) {
        board.parentNode.insertBefore(scoreBoardContainer, board);
    } else {
        document.body.appendChild(scoreBoardContainer);
    }
}

function updateScore(winner) {
    if(winner === player1Symbol) {
        player1Score++;
        const scoreElement = document.querySelector('#player-1-score');
        if (scoreElement) {
            scoreElement.textContent = player1Score;
        }
    } else if (winner === player2Symbol) {
        player2Score++; 
        const scoreElement = document.querySelector('#player-2-score');
        if (scoreElement) {
            scoreElement.textContent = player2Score;
        }
    } else {
        tiesScore++;
        const scoreElement = document.querySelector('#ties-score');
        if (scoreElement) {
            scoreElement.textContent = tiesScore;
        }
    }
}

// This is our UI checker - shows messages and disables board
function checkForWinner() {
    const winner = getWinner();
    
    if (winner) {
        updateScore(winner);
        disableBoard();
        
        // Add visual indication for winning cells
        highlightWinningCells(winner);
        
        return true;
    }

    let isDraw = [...cells].every(cell => cell.textContent !== '');
    if (isDraw) {
        updateScore('draw');
        disableBoard();
        return true;
    }
    
    return false;
}

function highlightWinningCells(winner) {
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

        if (cellA === winner && cellA === cellB && cellB === cellC) {
            // Highlight winning cells
            cells[a].style.backgroundColor = '#27ae60';
            cells[b].style.backgroundColor = '#27ae60';
            cells[c].style.backgroundColor = '#27ae60';
            cells[a].style.color = 'white';
            cells[b].style.color = 'white';
            cells[c].style.color = 'white';
            break;
        }
    }
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

        if (!cells || !cells[a] || !cells[b] || !cells[c]) {
            continue; // Skip if any cell is undefined
        }

        let cellA = cells[a].textContent;
        let cellB = cells[b].textContent;
        let cellC = cells[c].textContent;

        if (cellA !== '' && cellA === cellB && cellB === cellC) {
            return cellA;
        }
    }
    
    return null;
}

function disableBoard() {
    if (!cells) return;
    
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

function resetScoreBoard() {
    player1Score = 0;
    player2Score = 0;
    tiesScore = 0;

    const player1ScoreElement = document.querySelector('#player-1-score');
    const player2ScoreElement = document.querySelector('#player-2-score');
    const tiesScoreElement = document.querySelector('#ties-score');
    
    if (player1ScoreElement) player1ScoreElement.textContent = player1Score;
    if (player2ScoreElement) player2ScoreElement.textContent = player2Score;
    if (tiesScoreElement) tiesScoreElement.textContent = tiesScore;
}

function handleHeadingClick() {
    let heading = document.querySelector('#nav-heading');
    if (!heading) return;

    // Create a new element to replace the old one (removing all listeners)
    const newHeading = heading.cloneNode(true);
    heading.parentNode.replaceChild(newHeading, heading);
    
    // Update the reference
    heading = document.querySelector('#nav-heading');
    
    heading.addEventListener('click', () => {
        if (board) {
            board.classList.remove('board');
            board.classList.add('hidden');
        }
        resetScoreBoard();
        playerChoice();
    });
}

function verticalNav() {
    let verticalNavDiv = document.querySelector('.vertical-nav-section');
    if (!verticalNavDiv || !biListButton) return;

    // Clean up existing listeners
    const newBiListButton = biListButton.cloneNode(true);
    biListButton.parentNode.replaceChild(newBiListButton, biListButton);
    
    // Update the reference
    const updatedBiListButton = document.querySelector('.bi-list');
    
    updatedBiListButton.addEventListener('click', (event) => {
        verticalNavDiv.classList.toggle('hidden');
        updatedBiListButton.classList.add('hidden'); 
        event.stopPropagation();
    });

    // Use a named function so we can remove it if needed
    const handleClickOutside = (event) => {
        if(!verticalNavDiv.contains(event.target) && !updatedBiListButton.contains(event.target)) {
            verticalNavDiv.classList.add('hidden');
            updatedBiListButton.classList.remove('hidden');
        }
    };
    
    // Remove any existing listener and add a new one
    document.body.removeEventListener('click', handleClickOutside);
    document.body.addEventListener('click', handleClickOutside);
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    resetGame();
    handleHeadingClick();
    verticalNav();
});