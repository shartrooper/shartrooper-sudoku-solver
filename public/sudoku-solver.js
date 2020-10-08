const textArea = document.getElementById('text-input');
const rows = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
    'G': 6,
    'H': 7,
    'I': 8
};
//Most Puzzle value updates will use the globalPuzzleArr for consistency between the textArea and grid.
let globalPuzzleArr, twoDimArr;

import {
    puzzlesAndSolutions
}
from './puzzle-strings.js';

const sudokuSolver = () => {

    //The input string goes through a regex pattern treatment and has everything (except the desired inputs) replaced with a dot.
    const checkLegitInput = (input) => {
        let validityRegex = /[^1-9.]/;

        return input.toString().replace(validityRegex, '.');
    }

    //Another string treatment. If empty, returns a string of 81 dots.
    const getArrayFromString = str => str.length ? checkLegitInput(str).split('') : '.'.repeat(81).split('');

    //Core grid update function.
    const drawOnCells = arr => {
        const cells = document.querySelectorAll('.sudoku-input');
        let i = 0;

        for (const cell of cells) {
            let num = arr[i];

            num !== '.' ? cell.value = num : cell.value = '';
            i++;
        }
    }

    //This expression gets actual puzzle value index from grid cell position: F(x)= n*10+x-(n+1). For n=row and x=col.
    //Both argument values have to be typeof 'number'.
    const calculateIndex = (row, col) => (row * 10) + col - (row + 1);

    // Any puzzle length different than 81 charactes will not trigger a DOM change for grid and global.

    const handleTextArea = function () {
        this.value = checkLegitInput(this.value);

        if (this.value.length !== 81) {
            return;
        }
        // Not implemented due to meet the requirements of 9th challenge user's story.
        // Anything more than equal to 81 will get sliced then trigger a DOM change.
        /*else if (this.value.length > 81)
        this.value = this.value.split('').slice(0, 81).join('');*/
        globalPuzzleArr = this.value.split('');
        drawOnCells(globalPuzzleArr);
    }

    const handleGridInput = function () {
        let checkValue = this.value?checkLegitInput(this.value):'';

        /*if (checkValue === '.') {
        return this.value = '';
        }*/
        this.value = checkValue === '.' ? '' : checkValue;
        // To determine proper elem position on puzzle string. Letters are rows value and num represents column value
        const[letter, num] = this.id.split('');
        const idx = calculateIndex(rows[letter], parseInt(num));

        globalPuzzleArr[idx] = checkValue;
        textArea.value = globalPuzzleArr.join('');
    }

    const handleClear = () => {

        textArea.value = '';
        globalPuzzleArr = getArrayFromString(textArea.value);
        drawOnCells(globalPuzzleArr);
    }

    // A 9x9 2D Array is needed in order to the algorythm find a possible solution using backtrack method.
    const createTwoDimensionalArray = str => {
        /*let grid = [[], [], [], [], [], [], [], [], []],
        init = 0;
        const pushValues = (i, arr) => arr.forEach(value => grid[i].push(value));

        for (let i = 0; i < 9; i++) {
        init = i ? (!(i % 3) ? i * 9 : init + 3) : 0;

        let aux = init;
        for (let j = 0; j < 3; j++) {
        let getRowOfNum = str.substring(aux, aux + 3).split('');
        pushValues(i, getRowOfNum);
        aux += 9;
        }
        }

        return grid;*/
        let arr = [];

        for (let i = 0; i < Object.keys(rows).length; i++) {
            let nineLenStr = str.substring(i * 9, i * 9 + 9);
            arr.push(nineLenStr.split(''));
        }
        return arr;
    }

    const checkRow = (arr, col, num) => {
        let idx = arr.indexOf(num);

        if (idx === -1 || idx === col) {
            return false;
        }
        return true;
    }

    const checkCol = (arr, row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (arr[i][col] == num && i != row) {
                return true;
            }
        }
        return false;
    }

    const checkBox = (arr, row, rowOff, col, colOff, num) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (
                    arr[rowOff + i][colOff + j] == num &&
                    rowOff + i != row &&
                    colOff + j != col) {
                    return true;
                }
            }
        }
        return false;
    }

    const checkValid = (row, col, num) => {
        const foundInRow = checkRow(twoDimArr[row], col, num);
        const foundInCol = checkCol(twoDimArr, row, col, num);
        const foundInBox = checkBox(twoDimArr, row, row - (row % 3), col, col - (col % 3), num);

        return (!foundInRow && !foundInCol && !foundInBox) ? true : false;
    };

    const checkSolvable = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (twoDimArr[i][j] === '.') {
                    continue
                }
                if (!checkValid(i, j, twoDimArr[i][j])) {
                    return false
                }
            }
        }
        return true
    }

    const findEmpty = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (twoDimArr[i][j] === '.') {
                    return [i, j];
                }
            }
        }
        return false;
    }

    // Sudoku Backtracking-7 method explained on geeksforgeeks.org/sudoku-backtracking-7.
    // Makes sure of safe number before assignment then perform a recursive call until there are not free cells anymore.
    const findSolution = () => {
        const foundEmpty = findEmpty(twoDimArr);
        if (!foundEmpty)
            return true;

        const[row, col] = foundEmpty;
        for (let num = 1; num < 10; num++) {

            if (checkValid(row, col, num.toString())) {
                twoDimArr[row][col] = num.toString();
                if (findSolution()) {
                    return true;
                }
                // reset value and backtrack
                twoDimArr[row][col] = '.';
            }

        }
        return false;
    }

    const displayMsg = (elem)=> (visible, msg) => {
        elem.style.visibility = visible;
        elem.innerText = msg;
    }
    
    const solvePuzzle = () => {
        const {
            value
        } = textArea;
        const errorElem = displayMsg(document.getElementById('error-msg'));
        
        if (value.length !== 81) {

            errorElem('visible', 'Error: Expected puzzle to be 81 characters long.');
            return;
        }
        twoDimArr = createTwoDimensionalArray(value);
        if (!checkSolvable()) {
            errorElem('visible', 'Error: No solution.');
            return;
        }
        if (findSolution()) {
            errorElem('hidden', '');
            globalPuzzleArr = [].concat(...twoDimArr);
            textArea.value = globalPuzzleArr.join('');
            drawOnCells(globalPuzzleArr);
            return;
        }
        return displayMsg('visible', 'Error:No solution found');
    }

    return {
        checkLegitInput,
        getArrayFromString,
        drawOnCells,
        handleTextArea,
        handleGridInput,
        handleClear,
        createTwoDimensionalArray,
        solvePuzzle
    }

}

document.addEventListener('DOMContentLoaded', () => {
    let puzzlePicked = Math.floor(Math.random() * 5);
    // Load a random puzzle into the text area
    textArea.value = puzzlesAndSolutions[puzzlePicked][0];
    //textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const sudoku = sudokuSolver();
    globalPuzzleArr = sudoku.getArrayFromString(textArea.value);
    sudoku.drawOnCells(globalPuzzleArr);

    // Add event listener to all the 81 input fields on the grid
    let gridElems = document.getElementsByClassName('sudoku-input');
    Array.from(gridElems).forEach((ele) =>
        ele.addEventListener('input', sudoku.handleGridInput));
    // Add event listener to textArea, clear-button
    document.getElementById('clear-button').addEventListener('click', sudoku.handleClear);
    document.getElementById('solve-button').addEventListener('click', sudoku.solvePuzzle);
    textArea.addEventListener('input', sudoku.handleTextArea);
});

/*
Export your functions for testing in Node.
Note: The `try` block is to prevent errors on
the client side
 */
try {
    module.exports = {
        checkLegitInput: sudokuSolver().checkLegitInput,
        solvePuzzle: sudokuSolver().solvePuzzle,
        createTwoDimensionalArray:sudokuSolver().createTwoDimensionalArray,
        displayMsg: sudokuSolver().displayMsg,
        getArrayFromString: sudokuSolver().getArrayFromString,
        drawOnCells: sudokuSolver().drawOnCells
    }
} catch (e) {}
