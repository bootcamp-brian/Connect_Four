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
const gameAreaEl = document.querySelector('.gameArea');

// -----Form Interactions & Setup-----
    // clears previous game data and handles the necessary setup for a new game;
function setup(formData) {
    gameOver = false;
    gameAreaEl.style.background = 'white';
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
    // checks if the form submission has valid name submissions and provides a message if they aren't;
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

    // toggles the colors of the "Player 1" & "Player 2" text on the menu;
function colorChange() {
    p1El.classList.toggle('redText');
    p1El.classList.toggle('yellowText');
    p2El.classList.toggle('redText');
    p2El.classList.toggle('yellowText');
}

// -----Event Listeners-----

    // -----Form Submission Event Listeners-----
    // creates a formdata event when the menu form is submitted;
formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    new FormData(formEl);
})

    // takes the formdata event, extracts its data into the formData object, uses that info to setup a new game, and then hides the menu;
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
    // These two event listeners handle toggling the input element for the player 2 name submission between enabled and disabled based on which game mode is selected;
singlePlayerEl.addEventListener('change', () => {
    player2Name.toggleAttribute("disabled")
    player2Name.value = 'Computer';
})

twoPlayerEl.addEventListener('change', () => {
    player2Name.toggleAttribute("disabled")
})

    // These 4 event listeners handle the effects for when the player color choices are clicked on the menu;
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
    // opens and closes the menu;
menuButtonEl.addEventListener('click', () => {
    formEl.classList.toggle('hidden');
})

    // -----Gameboard Arrows Event Listner-----
    // triggers the addPiece function using the column of the arrow clicked as an argument;
arrowsEl.addEventListener('click', (event)=> {
    const currentColumn = event.target.dataset.column;

    addPiece(currentColumn);
})

// -----Gameboard Creation Functions-----
    // creates a new board based on the given number of columns and rows and sets that as the gameState's board value,
    // sets dimensions for appropriate elements, and renders the board;
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

    // clears the previous board and displays the updated one;
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

    // creates the cell elements of the board and gives them the appropriate class based on its corresponding spot on the gameState board array;
function createBoardCell(columnIndex, rowIndex) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.dataset.column = columnIndex;
    cell.dataset.row = rowIndex;
    cell.classList.add(`${gameState.board[columnIndex][rowIndex]}`);
    boardEl.appendChild(cell);
}

    // creates the arrow elements used to add pieces to the board;
function createArrowCell(columnIndex) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.dataset.column = columnIndex;
    cell.classList.add('arrow');
    arrowsEl.appendChild(cell);
}

// -----Game Logic Functions-----
    // takes an array of arrays of piece coordinates and a string corresponding to the current player,
    // then compares the values of the gameState's board at the given coordinates to the string to see if they match;
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

    // takes an array of an x and y value and a string corresponding to the current player,
    // then checks to see if there are any winning sets of pieces that include the cell at the given coordinates,
    // and returns an array of the coordinates of those pieces if so, otherwise returns false;
function check4Win(coords, currentPlayer) {
    const verticalPieces = [];
    const horizontalPieces = [];
    const diagonalUpPieces = [];
    const diagonalDownPieces = [];
    const winCon = Number(gameState.winCon);
    const currentColumn = coords[0];
    const currentRow = coords[1];

    // iterates through the given cell and the 3 spots below it and puts them in an array,
    // then passes that array through the checkPieces function with the currentPlayer value to check for a win;
    for (let i = 0; i < winCon; i++) {
        verticalPieces.push([currentColumn, currentRow - i]);
    }
    if (checkPieces(verticalPieces, currentPlayer)) {
        return verticalPieces;
    }

    // iterates through cells horizontally starting from the left based on the game's winCon,
    // pushes them into an array until its length equals the winCon and passes it through the checkPieces to check for a win,
    // returns that array if its a win, otherwise removes the first cell and continues iterating,
    // repeats until it finds a win or has checked all possible sets of cells that include the cell originally provided;
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

    // iterates through cells starting to the left and down based on winCon to check for a win by...
    // using i and j to increase the x and y values respectively,
    // and passes arrays of the appropriate length through the checkPieces function to check for wins;
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

    // iterates through cells starting to the left and up based on winCon to check for a win by...
    // using i and j to decrease the x and y values respectively,
    // and passes arrays of the appropriate length through the checkPieces function to check for wins;

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

    // checks for a draw by seeing if all of the cells at the top have been filled;
function check4Draw() {
    for (let i = 0; i < gameState.board.length; i++) {
        if (!(gameState.board[i][gameState.board[i].length - 1])) {
            return false;
        }
    }
    return true;
}

    // makes a set of cells flash green a few times to signify a win;
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

    // checks for game ending conditions and provides the appropriate message and disables the ability to place more pieces;
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

    // changes the player turn and provides a notification of whose turn it is;
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

    // creates an animation of a piece being dropped down a column and of a win if there is one, then changes the turn if there isn't,
    // also re-enables the ability to place pieces;
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
        if (gameState.gameMode === 'twoPlayer') {
            arrowsEl.classList.toggle('loading');
        }
        if (win) {
            winFlash(win)
            gameOver = true;
        }
        if (!endGame()) {
            changeTurn();
        }
    }, timer)
}

    // adds a piece to the board if the move is valid and performs the appropriate actions in response,
    // such as having the computer place a piece if in singlePlayer gameMode;
    // and prevents additional pieces being placed until finished;
function addPiece(currentColumn) {
    const column = gameState.board[currentColumn];

    if (!column[column.length]) {
        for (let i = 0; i < column.length; i++) {
            if (!column[i]) {
                arrowsEl.classList.toggle('loading');
                animateMove([currentColumn, i]);
                if (!gameOver && gameState.gameMode === 'singlePlayer') {
                    setTimeout(() => {
                        aiMove();
                        setTimeout(() => {   
                            arrowsEl.classList.toggle('loading');
                        }, timer + 1000)
                    }, timer + 1000)
                }
                return
            }
        }
    }
    return false;
}

    // makes a move for the computer;
function aiMove() {
    // checks for a win by going through each possible move and using the check4Win function to...
    // determine if that move would be a win, then performs that move if a win is found and stops the function;
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

    // checks to see if the other player will win at each possible move and blocks the first one it finds if there is one and stops the function;
    for (let i = 0; i < gameState.board.length; i++) {
        const playerIndex = Number(gameState.playerIndex);
        const nextPlayer = playerIndex === gameState.players.length - 1 ? gameState.players[0] : gameState.players[playerIndex + 1];
        const column = gameState.board[i];

        if (!column[column.length]) {
            for (let j = 0; j < column.length; j++) {
                if (!column[j]) {
                    gameState.board[i][j] = nextPlayer;
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

    // chooses a random column, checks to make sure the column isn't filled and choose a new one until finding an unfilled column,
    // then places a piece there;
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