const gameState = {};
let gameOver;
let timer;

// -----DOM References-----

const boardEl = document.querySelector('.board');
const arrowsEl = document.querySelector('.arrows');
const gameMessageEl = document.querySelector('#gameMessage');
const singlePlayerEl = document.querySelector('#singlePlayer');
const twoPlayerEl = document.querySelector('#twoPlayer');
const formEl = document.querySelector('form');
const messageEl = document.querySelector('#message');
const player2Name = document.querySelector("#player2Name");
const menuButtonEl = document.querySelector('#menuButton');
const p1Red = document.querySelector('#p1Red');
const p2Red = document.querySelector('#p2Red');
const p1Yellow = document.querySelector('#p1Yellow');
const p2Yellow = document.querySelector('#p2Yellow');
const p1El = document.querySelector('#p1');
const p2El = document.querySelector('#p2');
const p1NameDisplayEl = document.querySelector('#p1NameDisplay');
const p2NameDisplayEl = document.querySelector('#p2NameDisplay');

// -----Form Interactions & Setup-----

function setup(formData) {
    gameOver = false;
    gameState.rows = formData.rows;
    gameState.columns = formData.columns;
    gameState.players = [formData.p1ColorChoice, formData.p2ColorChoice];
    gameState.winCon = formData.winCon;
    gameState.gameMode = formData.gameMode;
    
    if (formData.gameMode === 'singlePlayer') {
        gameState.playerIndex = 0;
    } else {
        gameState.playerIndex = Math.floor(Math.random() * gameState.players.length);
    }

    gameState.currentPlayer = gameState.players[gameState.playerIndex];

    gameMessageEl.textContent = `${gameState.currentPlayer}'s Turn`;
    gameMessageEl.style.color = gameState.currentPlayer;

    p1NameDisplayEl.innerHTML = formData.player1Name;
    p1NameDisplayEl.style.color = formData.p1ColorChoice;
    
    if (formData.player2Name) {
        p2NameDisplayEl.innerHTML = formData.player2Name;
    } else {
        p2NameDisplayEl.innerHTML = 'Computer';
    }
    p2NameDisplayEl.style.color = formData.p2ColorChoice;
    
    arrowsEl.classList.remove('disabled');
}

function checkFormValid(formData) {
    if (formData.player1Name.trim() === '') {
        messageEl.textContent = 'Please enter a name for player 1';
        return false;
    }
    if (formData.player2Name !== undefined) {   
        if (formData.player2Name.trim() === '') {
            messageEl.textContent = 'Please enter a name for player 2';
            return false;
        }
        return true;
    }
    return true;
}

function colorChange() {
    p1El.classList.toggle('redText');
    p1El.classList.toggle('yellowText');
    p2El.classList.toggle('redText');
    p2El.classList.toggle('yellowText');
}

// -----Event Listeners-----

    // -----Form Submission Event Listeners-----

formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    new FormData(formEl);
})

formEl.addEventListener('formdata', (event) => {
    const data = event.formData
    formData = Object.fromEntries(data);
    if(!checkFormValid(formData)) {
        return;
    }
    messageEl.textContent = '';
    setup(formData);
    createBoard(Number(formData.columns), Number(formData.rows));
    formEl.classList.toggle('hidden');
})

    // -----Form Elements Event Listners-----

singlePlayerEl.addEventListener('change', () => {
    player2Name.toggleAttribute("disabled")
    player2Name.value = 'Computer';
})

twoPlayerEl.addEventListener('change', () => {
    player2Name.toggleAttribute("disabled")
})

p1Red.addEventListener('change', () => {
    p2Yellow.checked = true;
    colorChange();
})

p2Red.addEventListener('change', () => {
    p1Yellow.checked = true;
    colorChange();
})

p1Yellow.addEventListener('change', () => {
    p2Red.checked = true;
    colorChange();
})

p2Yellow.addEventListener('change', () => {
    p1Red.checked = true;
    colorChange();
})

    // -----Menu Button Event Listener-----

menuButtonEl.addEventListener('click', () => {
    formEl.classList.toggle('hidden');
})

    // -----Gameboard Arrows Event Listner-----

arrowsEl.addEventListener('click', (event)=> {
    const currentColumn = event.target.dataset.column;

    addPiece(currentColumn);
})

// -----Gameboard Creation Functions-----

function createBoard(columns, rows) {
    const board = [];

    boardEl.style.width = `${columns * 8}vmin`;
    boardEl.style.height = `${rows * 8}vmin`;
    arrowsEl.style.width = `${columns * 8}vmin`;

    for (let i = 0; i < columns; i++) {
        const column = [];

        for (let i = 0; i < rows; i++) {
            column.push(null);
        }
        board.push(column);
    }

    gameState.board = board;
    renderBoard();
}

function renderBoard() {
    arrowsEl.innerHTML = '';
    boardEl.innerHTML = '';

    for (let i = 0; i < gameState.board.length; i++) {
        createArrowCell(i);
    }
    gameState.board.forEach((column, rowIndex) => {
        for (let i = 0; i < column.length; i++) {
            createBoardCell(rowIndex, i);
        }
    })
}

function createBoardCell(columnIndex, rowIndex) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.dataset.column = columnIndex;
    cell.dataset.row = rowIndex;
    cell.classList.add(`${gameState.board[columnIndex][rowIndex]}`);
    boardEl.appendChild(cell);
}

function createArrowCell(columnIndex) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.dataset.column = columnIndex;
    cell.classList.add('arrow');
    arrowsEl.appendChild(cell);
}

// -----Game Logic Functions-----

function checkPieces(pieces, currentPlayer) {
    for (let piece of pieces) {
        const columnIndex = piece[0];
        const rowIndex = piece[1];
        if (gameState.board[columnIndex][rowIndex] !== currentPlayer) {
            return false;
        }
    }
    return true;
}

function check4Win(coords, currentPlayer) {
    const verticalPieces = [];
    const horizontalPieces = [];
    const diagonalUpPieces = [];
    const diagonalDownPieces = [];
    const winCon = Number(gameState.winCon);
    const currentColumn = coords[0];
    const currentRow = coords[1];

    for (let i = 0; i < winCon; i++) {
        verticalPieces.push([currentColumn, currentRow - i]);
    }
    if (checkPieces(verticalPieces, currentPlayer)) {
        return verticalPieces;
    }

    for (let i = currentColumn - (winCon - 1); i < currentColumn + winCon; i++) {
        if (i < 0) {
            i = 0;
        } else if (i >= Number(gameState.columns)) {
            break;
        }

        horizontalPieces.push([i, currentRow]);

        if (horizontalPieces.length === winCon) {
            if (checkPieces(horizontalPieces, currentPlayer)) {
            return horizontalPieces;
            }
            horizontalPieces.shift();
        }
    }

    let j = currentRow - (winCon - 1);

    for (let i = currentColumn - (winCon - 1); i < currentColumn + winCon; i++) {
        if (i < 0) {
            j++;
            continue;
        } else if (i >= Number(gameState.columns)) {
            break;
        }
        if (j < 0 ) {
            j++;
            continue;
        } else if (j >= Number(gameState.columns)) {
            break;
        }
        diagonalUpPieces.push([i, j]);
        j++;
        if (diagonalUpPieces.length === winCon) {
            if (checkPieces(diagonalUpPieces, currentPlayer)) {
                return diagonalUpPieces;
            } else {
                diagonalUpPieces.shift();
            }
        }
    }

    j = currentRow + (winCon - 1);
    for (let i = currentColumn - (winCon - 1); i < currentColumn + winCon; i++) {
        if (i < 0) {
            j--;
            continue;
        } else if (i >= Number(gameState.columns)) {
            break;
        }
        if (j >= Number(gameState.columns)) {
            j--;
            continue;
        } else if (j < 0) {
            break;
        }

        diagonalDownPieces.push([i, j]);
        j--;

        if (diagonalDownPieces.length === winCon) {
            if (checkPieces(diagonalDownPieces, currentPlayer)) {
                return diagonalDownPieces;
            } else {
                diagonalDownPieces.shift();
            }
        }
    }
    return false;
}

function check4Draw() {
    for (let i = 0; i < gameState.board.length; i++) {
        if (!(gameState.board[i][gameState.board[i].length - 1])) {
            return false;
        }
    }
    return true;
}

function winFlash(winningCoords) {
    const savedColor = gameState.board[winningCoords[0][0]][winningCoords[0][1]];
    let counter = 0;

    const flash = setInterval(() => {
        for (let coords of winningCoords) {
            const column = coords[0];
            const row = coords[1];

            if (gameState.board[column][row] !== 'green') {
                gameState.board[column][row] = 'green';
            } else {
                gameState.board[column][row] = savedColor;
            }
        }
        renderBoard();
        counter++;
        if (counter === 6) {
            clearInterval(flash);
        }
    }, 400)
}

function endGame() {
    if (gameOver) {
        gameMessageEl.textContent = `${gameState.currentPlayer} Wins!`;
        gameMessageEl.style.color = 'green';
        arrowsEl.classList.add('disabled');
        return true;
    } else if (check4Draw()) {
        gameMessageEl.textContent = "It's a draw!"
        gameMessageEl.style.color = 'white';
        arrowsEl.classList.add('disabled');
        return true;
    }
}

function changeTurn() {
    if (gameState.playerIndex === gameState.players.length - 1) {
        gameState.playerIndex = 0;
    } else {
        gameState.playerIndex++;
    }
    gameState.currentPlayer = gameState.players[gameState.playerIndex];
    gameMessageEl.textContent = `${gameState.currentPlayer}'s Turn`;
    gameMessageEl.style.color = gameState.currentPlayer;
}

function animateMove(coords) {
    timer = 0;
    const currentColumn = coords[0];
    const currentRow = coords[1];
    const currentPlayer = gameState.currentPlayer;

    for (let i = gameState.board[0].length - 1; i > currentRow; i--) {
        setTimeout(() => {
            gameState.board[currentColumn][i] = currentPlayer;
            renderBoard();
        }, timer)
        timer += 100;
        setTimeout(() => {
            gameState.board[currentColumn][i] = null;
            renderBoard();
        }, timer)
        timer += 100;
    }

    setTimeout(() => {
        gameState.board[currentColumn][currentRow] = currentPlayer;
        renderBoard();
        const win = check4Win(coords, gameState.currentPlayer);
        arrowsEl.classList.toggle('loading');
        if (win) {
            winFlash(win)
            gameOver = true;
        }
        if (!endGame()) {
            changeTurn();
        }
    }, timer)
}

function addPiece(currentColumn) {
    const column = gameState.board[currentColumn];

    if (!column[column.length]) {
        for (let i = 0; i < column.length; i++) {
            if (!column[i]) {
                arrowsEl.classList.toggle('loading');
                animateMove([currentColumn, i]);
                if (!gameOver) {
                    setTimeout(() => {
                        if (gameState.gameMode === 'singlePlayer') {
                            aiMove();
                            arrowsEl.classList.toggle('loading');
                        }
                    }, timer)
                }
                return
            }
        }
    }
    return false;
}

function aiMove() {
    for (let i = 0; i < gameState.board.length; i++) {
        const column = gameState.board[i];
        
        if (!column[column.length]) {
            for (let j = 0; j < column.length; j++) {
                if (!column[j]) {
                    gameState.board[i][j] = gameState.currentPlayer;
                    if (check4Win([i, j], gameState.currentPlayer)) {
                        gameState.board[i][j] = null;
                        animateMove([i, j]);
                        return;
                    } else {
                        gameState.board[i][j] = null;
                    }
                    break;
                }
            }
        }
    }

    for (let i = 0; i < gameState.board.length; i++) {
        const playerIndex = Number(gameState.playerIndex);
        const nextPlayer = playerIndex === gameState.players.length - 1 ? gameState.players[0] : gameState.players[playerIndex + 1];
        const column = gameState.board[i];

        if (!column[column.length]) {
            for (let j = 0; j < column.length; j++) {
                console.log(j, column[j])
                if (!column[j]) {
                    gameState.board[i][j] = nextPlayer;
                    console.log([i, j], nextPlayer, check4Win([i, j], nextPlayer))
                    if (check4Win([i, j], nextPlayer)) {
                        gameState.board[i][j] = null;
                        animateMove([i, j]);
                        return;
                    } else {
                        gameState.board[i][j] = null;
                    }
                    break;
                }
            }
        }
    }

    let randomColumn = Math.floor(Math.random() * gameState.board.length);

    while (gameState.board[randomColumn][Number(gameState.rows)]) {
        randomColumn = Math.floor(Math.random() * gameState.board.length);
    }
    const column = gameState.board[randomColumn];

    for (let i = 0; i < column.length; i++) {
        if (!column[i]) {
            animateMove([randomColumn, i]);
            return;
        }
    }
}