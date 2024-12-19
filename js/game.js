'use strict'

const ROWS = 4
const COLUMNS = 4
const MINES = 2
const SIZE = ROWS * COLUMNS

const MINE = '💣'
const EMPTY = ' '
const MARK = `<span>&#9873;</span>`
const GAME_OVER = 'Game Over!'
const CONGRATS = 'You Won!'
const GAMING_SMILE = '😀'
const WINNING_SMILE = '🤩'
const LOOSING_SMILE = '☹️'

var gBoard = []
var minesPositions = []

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gRevealed = 0
var gMarkedCorrect = 0
var gLives = 3

function onInit() {
    console.log('Initiating game...')
    gRevealed = 0
    gMarkedCorrect = 0
    gLives = 3
    setModalState(false, '')
    document.getElementsByClassName('emoji')[0].innerHTML = GAMING_SMILE
    document.getElementsByClassName('life')[0].innerText = `${gLives} lives left`
    gBoard = createEmptyMatrix(ROWS, COLUMNS)
    console.log("gBoard: ", gBoard)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
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
                minesAroundCount: 0,
                isShown: false,
                isMine: isMine,
                isMarked: false
            })
        }
        board.push(row)
    }
    return board
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

function positionsArray(board, rowIdx, colIdx) {
    var positions = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (!gBoard[i][j].isShown) positions.push({ i, j })
        }
    }
    return positions
}

function onFirstClick(i, j) {
    console.log("first click i, j: ", i, j);
    minesPositions = createMinesPositions(i, j)
    gBoard = createBoardData()
    setBoardWithMinesCounters(gBoard)
}

function onCellClicked(elCell, i, j, event) {
    if (gRevealed === 0) {
        onFirstClick(i, j)
    }
    var cellData = gBoard[i][j]
    if (!gGame.isOn || cellData.isShown) return
    if (event.button === 2) {
        renderCell({ i, j }, cellData.isMarked ? EMPTY : MARK)
        cellData.isMarked = !cellData.isMarked
    } else {
        if (cellData.content === MINE) {
            gLives--
            alert('Carful! you clicked a mine!')
            document.getElementsByClassName('life')[0].innerText = `${gLives} lives left`
            if (gLives === 0) {
                gGame.isOn = false
                revealCells(minesPositions)
                gameOver()
                return
            }
            return
        } else if (cellData.content === EMPTY || cellData.content > 0) {
            //* this condition is only for when the cell is empty
            if (cellData.content === EMPTY) {
                var pos = positionsArray(gBoard, i, j)
                gRevealed += pos.length
                revealCells(pos)
            }
            //* reveals both empty and counting cells
            renderCell({ i, j }, cellData.content)
            removeClassFromElement({ i, j }, 'shadow')
            addClassToElement({ i, j }, 'revealed')
            gBoard[i][j].isShown = true
            gRevealed++
        }
    }
    checkWin()
}

function revealCells(pos) {
    for (var n = 0; n < pos.length; n++) {
        var { i, j } = pos[n]
        gBoard[i][j].isShown = true
        renderCell(pos[n], gBoard[i][j].content)
        removeClassFromElement({ i, j }, 'shadow')
        addClassToElement({ i, j }, 'revealed')
    }
}

function gameOver() {
    document.getElementsByClassName('emoji')[0].innerHTML = LOOSING_SMILE
    setModalState(true, GAME_OVER)
    reset()
}

function reset() {
    console.log('Resetting game...')
    gBoard = []
    minesPositions = []
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gRevealed = 0
    gMarkedCorrect = 0
    gLives = 3
}

function checkWin() {
    console.log('Checking...')
    var allMarked = true
    for (var i = 0; i < minesPositions.length; i++) {
        var pos = minesPositions[i]
        if (!gBoard[pos.i][pos.j].isMarked || !gBoard[pos.i][pos.j].isMine) {
            allMarked = false
            break
        }
    }
    if (!(allMarked && SIZE - MINES === gRevealed)) return
    document.getElementsByClassName('emoji')[0].innerHTML = WINNING_SMILE
    setModalState(true, CONGRATS)
    reset()
}