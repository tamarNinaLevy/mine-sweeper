'use strict'

const ROWS = 8
const COLUMNS = 8
const MINES = 14
const SIZE = ROWS * COLUMNS

const MARK = `<span>&#9873;</span>`
const EMPTY = ' '
const GAME_OVER = 'Game Over!'
const CONGRATS = 'You Won!'
const MINE = '💣'
const GAMING_SMILE = '😀'
const WINNING_SMILE = '🤩'
const LOOSING_SMILE = '☹️'
const HINT = '💡'

var gBoard = []
var gMinesPositions = []

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLives = 3
var gHintsCount = 0
var gHintOn = false
var gScore = 0

//TODO
//TODO rename positionsArray
//TODO pos var for positions array in onCellClicked make it in the beginning for everyone
//TODO make renderCell, revealCell, removeClass, addClass in one function for all use cases
//TODO represent lives left with hearts
//TODO position modal in center
//TODO add seconds and score to modal
//TODO seconds timer

function onInit() {
    console.log('Initiating game...')
    resetGlobalVariables()
    resetElements()
    displayHints()
    gBoard = createEmptyMatrix(ROWS, COLUMNS)
    renderBoard(gBoard, '.board-container')
}

function resetGlobalVariables() {
    gBoard = []
    gMinesPositions = []
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gGame.shownCount = 0
    gLives = 3
    gHintsCount = 0
    gHintOn = false
    gScore = 0
}

function resetElements() {
    setModalState(false, '')
    document.querySelectorAll('.score')[0].innerHTML = `score: 0`
    document.getElementsByClassName('hints')[0].innerHTML = ``
    document.getElementsByClassName('emoji')[0].innerHTML = GAMING_SMILE
    document.getElementsByClassName('life')[0].innerText = `${gLives} lives left`
}

function displayHints() {
    var hints = document.getElementsByClassName('hints')[0]
    for (var i = 0; i < 3; i++) {
        var classStr = `hint hint-${i}`
        hints.innerHTML += `<span class="${classStr}" onclick="onHintClick(${i})">${HINT}</span>`
    }
}

function onHintClick(i) {
    var hintEl = document.getElementsByClassName(`hint-${i}`)[0]
    hintEl.classList.add('hint-click')
    hintEl.removeAttribute('onclick')
    gHintOn = true
    updateScore(-3)
}

function onFirstClick(i, j) {
    gMinesPositions = createMinesPositions(i, j)
    gBoard = createBoardData()
    setBoardWithMinesCounters(gBoard)
    gGame.isOn = true
    return
}

function onCellClicked(elCell, i, j, event) {
    if (gGame.shownCount === 0) {
        onFirstClick(i, j)
    }
    var cellData = gBoard[i][j]
    if (!gGame.isOn || cellData.isShown) {
        return
    }
    if (gHintOn) {
        handleUseHint(i, j, cellData.content)
        return
    }
    if (event && event.button === 2) {
        renderCell({ i, j }, cellData.isMarked ? EMPTY : MARK)
        cellData.isMarked = !cellData.isMarked
        for (var n = 0; n < gMinesPositions.length; n++) {
            if (gMinesPositions[n].i === i && gMinesPositions[n].j === j) {
                gGame.markedCount += cellData.isMarked ? 1 : -1
            }
        }
    } else {
        if (cellData.content === MINE) {
            handleMineClick()
            return
        }
        handleEmptyOrNumberClick(i, j, cellData.content)
        if (cellData.content === EMPTY) {
            fullExpansion(gBoard, i, j)
        }
    }
    checkWin()
}

function handleUseHint(i, j, content) {
    renderCell({ i, j }, content)
    removeClassFromElement({ i, j }, 'shadow')
    addClassToElement({ i, j }, 'revealed')
    var pos = positionsArray(gBoard, i, j)
    revealCells(pos, 'revealed', 'shadow')
    setTimeout(() => {
        revealCells(pos, 'shadow', 'revealed')
        renderCell({ i, j }, EMPTY)
        removeClassFromElement({ i, j }, 'revealed')
        addClassToElement({ i, j }, 'shadow')
    }, 1000)
    gHintOn = false
}

function handleMineClick() {
    alert('Carefull! you clicked a mine!')
    gLives--
    document.getElementsByClassName('life')[0].innerText = `${gLives} lives left`
    updateScore(-5)
    if (gLives === 0) {
        gGame.isOn = false
        revealCells(gMinesPositions, 'revealed', 'shadow')
        gameOver()
        return
    }
}

function fullExpansion(gBoard, i, j) {
    var cell = gBoard[i][j]
    if (cell.content === EMPTY) {
        var revealPos = positionsArray(gBoard, i, j)
        revealPos.filter((item) => item.content === MINE)
        revealCells(revealPos, 'revealed', 'shadow')
        gGame.shownCount += revealPos.length
        updateScore(revealPos.length)
        for (var k = 0; k < revealPos.length; k++) {
            fullExpansion(gBoard, revealPos[k].i, revealPos[k].j)
        }
    } else {
        return
    }
}

function handleEmptyOrNumberClick(i, j, content) {
    renderCell({ i, j }, content)
    removeClassFromElement({ i, j }, 'shadow')
    addClassToElement({ i, j }, 'revealed')
    gBoard[i][j].isShown = true
    gGame.shownCount++
    updateScore(1)
}

function updateScore(points) {
    gScore += points
    if (gScore < 0)
        gScore = 0
    document.querySelector('.score').innerHTML = `score: ${gScore}`
}

function revealCells(pos, addClass, removeClass) {
    for (var n = 0; n < pos.length; n++) {
        var { i, j } = pos[n]
        gBoard[i][j].isShown = !gBoard[i][j].isShown
        renderCell(pos[n], addClass === 'revealed' ? gBoard[i][j].content : EMPTY)
        removeClassFromElement({ i, j }, removeClass)
        addClassToElement({ i, j }, addClass)
    }
}

//* returns the unrevealed positions of the neighbours of a specific cell
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

function gameOver() {
    document.getElementsByClassName('emoji')[0].innerHTML = LOOSING_SMILE
    setModalState(true, GAME_OVER)
    resetGlobalVariables()
}

function checkWin() {
    console.log('Checking...')
    if (gGame.markedCount === MINES && (SIZE - MINES) === gGame.shownCount) {
        document.getElementsByClassName('emoji')[0].innerHTML = WINNING_SMILE
        setModalState(true, CONGRATS)
        gGame.isOn = false
        return
    }
}