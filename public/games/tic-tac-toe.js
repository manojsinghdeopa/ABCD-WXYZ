setupTheme();


import { burstConfetti } from '../confetti.js';

const board = document.getElementById('board');
const message = document.getElementById('message');
const scoreBoard = document.getElementById('score-board');
const playAgainBtn = document.getElementById('play-again');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let winsX = 0;
let winsO = 0;
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];




render();

playAgainBtn.addEventListener('click', resetGame);




function render() {
    board.innerHTML = '';
    const winningIndexes = getWinningIndexes();
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleClick(index));
        board.appendChild(cellDiv);

        if (winningIndexes.includes(index)) {
            cellDiv.classList.add(currentPlayer === 'X' ? 'winning-cell' : 'losing-cell');
            blockOrNone(playAgainBtn, 'block');
            if (currentPlayer === 'X') burstConfetti();
        }
    });
}

function getWinningIndexes() {
    return winConditions.flatMap(condition => {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return condition;
        }
        return [];
    });
}

function handleClick(index) {
    if (!gameBoard[index]) {
        gameBoard[index] = currentPlayer;
        render();
        if (checkWinner()) {
            endGame(`${currentPlayer === 'X' ? 'You' : 'Opponent'} wins !`);
            return;
        }
        if (gameBoard.every(cell => cell !== '')) {
            endGame("It's a draw!");
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `${currentPlayer === 'X' ? "It's your turn" : "Opponent's turn"}`;

        if (currentPlayer === 'O') {
            setTimeout(opponentMove, 1000);
        }
    }
}

function checkWinner() {
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function endGame(messageText) {
    message.textContent = messageText;
    if (messageText.includes('draw')) {
        disableClicks();
    } else {
        if (currentPlayer === 'X') {
            winsX++;
        } else {
            winsO++;
        }
        updateScoreboard();
    }
    blockOrNone(playAgainBtn, 'block');
}


function disableClicks() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.cursor = 'default';
        cell.removeEventListener('click', handleClick);
    });
}

function opponentMove() {
    const winningMoveIndex = getWinningMoveIndex('O');
    const blockingMoveIndex = getWinningMoveIndex('X');

    if (winningMoveIndex !== -1) {
        gameBoard[winningMoveIndex] = 'O';
    }

    else if (blockingMoveIndex !== -1) {
        gameBoard[blockingMoveIndex] = 'O';
    }

    else {
        const emptyCells = gameBoard.reduce((acc, val, index) => {
            if (val === '') acc.push(index);
            return acc;
        }, []);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const chosenCellIndex = emptyCells[randomIndex];
        gameBoard[chosenCellIndex] = 'O';
    }

    render();

    if (checkWinner()) {
        endGame(`${currentPlayer === 'X' ? 'You' : 'Opponent'} wins !`);
        return;
    }
    if (gameBoard.every(cell => cell !== '')) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = 'X';
    message.textContent = "It's your turn";

}

function getWinningMoveIndex(player) {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = player;
            if (checkWinner()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return -1;
}


function blockOrNone(view, visibility) {
    view.style.display = visibility;
}

function resetGame() {
    blockOrNone(playAgainBtn, 'none');
    currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    message.textContent = `${currentPlayer === 'X' ? "It's your turn" : "Opponent's turn"}`;
    render();
    if (currentPlayer === 'O') {
        setTimeout(opponentMove, 1000);
    }
}

function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateStatusBarColor('#000000');
    } else {
        updateStatusBarColor('#ffffff');
    }
}

function updateStatusBarColor(color) {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', color);
}


function updateScoreboard() {
    scoreBoard.textContent = `${winsX} - ${winsO}`;
}


