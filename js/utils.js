'use strict'

function createEmptyMatrix(rows, columns) {
    var mat = []
    for (var i = 0; i < rows; i++) {
        mat[i] = []
        for (var j = 0; j < columns; j++) {
            mat[i].push('')
        }
    }
    return mat
}

function removeClassFromElement(location, className) {
    var cell = document.getElementsByClassName(`cell-${location.i}-${location.j}`)[0]
    cell.classList.remove(className)
}

function addClassToElement(location, className) {
    var cell = document.getElementsByClassName(`cell-${location.i}-${location.j}`)[0]
    cell.classList.add(className)
}

function setModalState(show, text) {
    console.log('Setting modal state...');
    const modal = document.getElementsByClassName('modal')[0]
    if (show) {
        modal.classList.remove('hide')
        modal.classList.add('show')
        const header = document.getElementsByClassName('header')[0]
        header.innerHTML = text
    } else {
        modal.classList.remove('show')
        modal.classList.add('hide')
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}