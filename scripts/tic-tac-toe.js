let board = document.querySelector('.board');
let restartButton = document.querySelector('.js-restart-button');

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

    currentPlayer = localStorage.getItem('playerChoice') || 'X';

    setUpEventListeners();

    board.classList.remove('hidden'); // Show board
    board.classList.add('board');
    restartButton.classList.remove('hidden'); // Show restart button
    restartButton.classList.add('restart-button');
}

function setUpEventListeners() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => handleMove(cell));
    });
}

function handleMove(cell) {
    if(cell.textContent !== '') return;

    cell.textContent = currentPlayer;

    if (checkWinner()) {
        return;
    };

    switchTurn();
}

function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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
        localStorage.setItem('playerChoice', choice);
        container.classList.add('hidden');
        initializeBoard();
    }

    xButton.addEventListener('click', () => handleChoice('X'));
    oButton.addEventListener('click', () => handleChoice('O'));
}

function checkWinner() {
    const cells = document.querySelectorAll('.cell');
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
            displayMessage(`winner is ${cellA}`);
            disableBoard();
            return true;
        }

        let isDraw = [...cells].every(cell => cell.textContent !== '');
        if (isDraw) {
            displayMessage(`It is a draw`);
            disableBoard();
        }
    }
    return false;
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
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    resetGame();
});
