'use strict'

function renderBoard(mat, selector) {
    console.log('Rendering...')
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
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

function removeClassFromElement(location, className) {
    var cell = document.getElementsByClassName(`cell-${location.i}-${location.j}`)[0]
    cell.classList.remove(className)
}

function addClassToElement(location, className) {
    var cell = document.getElementsByClassName(`cell-${location.i}-${location.j}`)[0]
    cell.classList.add(className)
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
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