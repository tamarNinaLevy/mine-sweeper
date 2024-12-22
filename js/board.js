'use strict'

function renderBoard(mat, selector) {
    console.log('Rendering...')
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const className = `cell cell-${i}-${j} shadow`
            strHTML += `<td class="${className}" onmousedown="onCellClicked(this, ${i}, ${j}, event)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    var cell = document.getElementsByClassName(`cell-${location.i}-${location.j}`)[0]
    cell.innerHTML = value
}

function createBoardData() {
    console.log('Creating board...')
    var board = []
    var posCounter = 0
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLUMNS; j++) {
            posCounter++
            var posIndex = minesPositions.findIndex((val) => val === posCounter)
            var isMine = false
            if (posIndex !== -1 && posCounter === minesPositions[posIndex]) {
                minesPositions[posIndex] = { i, j }
                isMine = true
            }
            row.push({
                isShown: false,
                isMine: isMine,
                isMarked: false
            })
        }
        board.push(row)
    }
    return board
}

function createMinesPositions(i, j) {
    console.log('Mining...')
    var mines = []
    var cellNum = (gBoard[0].length * i) + (j + 1)
    for (var n = 0; n < MINES; n++) {
        var boardRandomPosition = getRandomInt(1, SIZE + 1)
        while (mines.includes(boardRandomPosition) || cellNum === boardRandomPosition) {
            boardRandomPosition = getRandomInt(1, SIZE + 1)
        }
        mines.push(boardRandomPosition)
    }
    return mines
}

function setBoardWithMinesCounters(board) {
    console.log('Setting mining data...')
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.content = MINE
            }
            else {
                var amount = countNeighborsWithMines(board, i, j)
                cell.content = amount > 0 ? amount : EMPTY
            }
        }
    }
    console.log("board: ", board);
    return board
}

function countNeighborsWithMines(board, rowIdx, colIdx) {
    var counter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                counter++
            }
        }
    }
    return counter
}