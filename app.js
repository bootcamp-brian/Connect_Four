const board = [];
let columns = 7;
let rows = 6;
let winCon = 4;

function createBoard(columns, rows) {
    let htmlBoard = '';
    let htmlColumn = '';

    for (let i = 0; i < rows + 1; i++) {
        htmlColumn += `<li class="row${i}"></li>`;
    }
    for (let i = 0; i < columns; i++) {
        htmlBoard += `<ul class="column${i}">` + htmlColumn + `<li class="arrow arrow${i}"></li></ul>`;
    }
    return htmlBoard;
}

const gameBoardEl = document.querySelector('.gameBoard');
gameBoardEl.innerHTML = createBoard(columns, rows);

for (let i = 0; i < columns; i++) {
    board.push([]);
}

const players = ['red', 'yellow'];
let playerNum = 0;
// playerNum = Math.floor(Math.random() * players.length);

const gameState = {
    board: board,
    players: players,
    currentPlayer: players[playerNum]
}
let currentPlayer = gameState.players.indexOf(gameState.currentPlayer)

const columnEls = gameBoardEl.querySelectorAll('ul');
const column0 = columnEls[0].querySelectorAll('li');


function check4Win(arr) {
    if (arr.length !== winCon) {
        return false;
    }
    for (let n of arr) {
        if (n !== gameState.currentPlayer) {
            return false;
        }
    }
    return true;
}
function checkVertical(board, i) {
    const currentColumnEl = columnEls[i].querySelectorAll('li');
    const currentRow = board[i].length - 1;
    const arr = [];
    const winLiEls = [];

    for (let j = 0; j < winCon; j++) {
        arr.push(board[i][currentRow - j]);
        winLiEls.push(currentColumnEl[currentRow - j])
    }
    if (check4Win(arr)) {
        return winLiEls;
    }
    return false;
}
function checkHorizontal(board, i) {
    const currentRow = board[i].length - 1;
    
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][currentRow]);
                winLiEls.push(currentColumnEl[currentRow]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    return false;
    // const arr = [currentMove];

    // for (let j = 1; arr.length < winCon; j++) {
    //     if (check4Win(arr)) {
    //         if (!(board[i + j])) {
    //             break;
    //         }
    //         arr.push(board[i + j][currentRow]);
    //         console.log(arr)
    //     } else {
    //         arr.pop();
    //         console.log(arr)
    //         break;
    //     }
    // }
    // if (arr.length === winCon) {
    //     if (check4Win(arr)) {
    //         return true;
    //     } else {
    //         arr.pop();
    //     }
    // }
    // for (let j = 1; arr.length < winCon; j++) {
    //     if (check4Win(arr)) {
    //         if (!(board[i -j])) {
    //             return false;
    //         }
    //         arr.push(board[i - j][currentRow]);
    //     } else {
    //         return false;
    //     }
    // }
    // return check4Win(arr);
}

function checkDiagonal(board, i) {
    const currentRow = board[i].length - 1;
    
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            const rowIndex = currentRow + (winCon - 1) - k - j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][rowIndex]);
                winLiEls.push(currentColumnEl[rowIndex]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            const rowIndex = currentRow - (winCon - 1) + k + j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][rowIndex]);
                winLiEls.push(currentColumnEl[rowIndex]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    return false;
}

function checkAll(board, i) {
    const currentColumnEl = columnEls[i].querySelectorAll('li');
    const currentRow = board[i].length - 1;
    const arr = [];
    const winLiEls = [];

    for (let j = 0; j < winCon; j++) {
        arr.push(board[i][currentRow - j]);
        winLiEls.push(currentColumnEl[currentRow - j])
    }
    if (check4Win(arr)) {
        return winLiEls;
    }
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][currentRow]);
                winLiEls.push(currentColumnEl[currentRow]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            const rowIndex = currentRow + (winCon - 1) - k - j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][rowIndex]);
                winLiEls.push(currentColumnEl[rowIndex]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    for (let j = 0; j < winCon; j++) {
        const arr = [];
        const winLiEls = [];
        for (let k = 0; k < winCon; k++) {
            const columnIndex = i - (winCon - 1) + k + j;
            const rowIndex = currentRow - (winCon - 1) + k + j;
            if (board[columnIndex]) {
                const currentColumnEl = columnEls[columnIndex].querySelectorAll('li');
                arr.push(board[columnIndex][rowIndex]);
                winLiEls.push(currentColumnEl[rowIndex]);
            }
        }
        if(check4Win(arr)) {
            return winLiEls;
        }
    }
    return false;
}

function winFlash(winningBoxes) {
    winningSet = winningBoxes;
    for (let li of winningSet) {
        li.classList.toggle('green');
    }
    let counter = 0;
    const intervalID = setInterval(() => {
        for (let li of winningSet) {
            li.classList.toggle('green');
        }
        counter++;
        if (counter === 7) {
            clearInterval(intervalID);
        }
    }, 500)
}
gameBoardEl.addEventListener('click', function(event) {
    for (let i = 0; i < columnEls.length; i++) {
        if (event.target.matches(`.arrow${i}`)) {
            gameBoardEl.classList.toggle('loading');
            if (board[i].length !== rows + 1) {
                board[i].push(gameState.currentPlayer);
                const currentColumnEl = columnEls[i].querySelectorAll('li');
                let timer = 0;
                for (let j = currentColumnEl.length - 2; j > board[i].length - 1; j--) {
                    setTimeout(() => {
                        currentColumnEl[j].classList.toggle(`${gameState.currentPlayer}`);
                    }, timer)
                    timer += 100;
                    setTimeout(() => {
                        currentColumnEl[j].classList.toggle(`${gameState.currentPlayer}`);
                    }, timer)
                    timer += 100;
                    // setTimeout(() => {
                    //     currentColumnEl[j].style.background = gameState.currentPlayer;
                    // }, timer)
                    // timer += 100;
                    // setTimeout(() => {
                    //     currentColumnEl[j].style.background = 'none';
                    // }, timer)
                    // timer += 100;
                }
                setTimeout(() => {
                    // currentColumnEl[board[i].length - 1].style.background = gameState.currentPlayer;
                    currentColumnEl[board[i].length - 1].classList.toggle(`${gameState.currentPlayer}`);
                    console.log(board)
                    if (checkAll(board, i)) {
                        winFlash(checkAll(board, i));
                    }
                    // if (checkVertical(board, i)) {
                    //     winFlash(checkVertical(board, i));
                    // } else if (checkHorizontal(board, i)) {
                    //     winFlash(checkHorizontal(board, i));
                    // } else if (checkDiagonal(board, i)) {
                    //     winFlash(checkDiagonal(board, i));
                    // }
                    if (currentPlayer === gameState.players.length - 1) {
                        currentPlayer = 0;
                    } else {
                        currentPlayer++
                    }
                    gameState.currentPlayer = gameState.players[currentPlayer];
                    gameBoardEl.classList.toggle('loading');
                }, timer)
            }
        }
    }
})







//click event triggers board[x].push(playermove) at corresponding column
        // if (!(board[i][board[i].length - (1 + j)])) {
        //     winningMove = false;
        //     break;
        // } else if (board[i][board[i].length - (1 + j)] !== currentMove) {
        //     winningMove = false;
        //     break;
        // }