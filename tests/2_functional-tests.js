/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
let Solver, domEvent;

suite('Functional Tests', () => {
    suiteSetup(() => {
        // DOM already mocked -- load sudoku solver then run tests
        let emptyArea = '.................................................................................';
        document.getElementById('text-input').value = emptyArea;
        domEvent = new window.Event("input");
        document.getElementById('text-input').dispatchEvent(domEvent);
        Solver = require('../public/sudoku-solver.js');
    });

    suite('Text area and sudoku grid update automatically', () => {
        // Entering a valid number in the text area populates
        // the correct cell in the sudoku grid with that number
        test('Valid number in text area populates correct cell in grid', done => {
            const textArea = document.getElementById('text-input');
            textArea.value = '12345';
            Solver.drawOnCells(Solver.getArrayFromString(textArea.value));
            let testArr = Array.from(document.querySelectorAll('.sudoku-input')).map(cell => cell.value);
            testArr = JSON.stringify(testArr.filter(str => str !== 'undefined'));
            const expected = JSON.stringify(['1', '2', '3', '4', '5']);

            assert.strictEqual(testArr, expected, 'Same arrays value');
            done();
        });

        // Entering a valid number in the grid automatically updates
        // the puzzle string in the text area
        test('Valid number in grid updates the puzzle string in the text area', done => {
            const textArea = document.getElementById('text-input');
            const gridCells = Array.from(document.querySelectorAll('.sudoku-input')).map(cell => cell);
            gridCells[0].value = '5';
            gridCells[1].value = '4';
            gridCells[2].value = '3';

            for (let i = 0; i < 3; i++) {
                gridCells[i].dispatchEvent(domEvent);
            }
            const expected = '543..............................................................................';
            //assert(console.log(textArea.value));
            assert.strictEqual(textArea.value, expected, 'Same arrays value');
            done();
        });
    });

    suite('Clear and solve buttons', () => {
        // Pressing the "Clear" button clears the sudoku
        // grid and the text area
        test('Function clearInput()', done => {
            const textArea = document.getElementById('text-input');
            document.getElementById('clear-button').click();
            const gridValues = Array.from(document.querySelectorAll('.sudoku-input')).map(cell => cell.value);

            assert.strictEqual(textArea.value, '', 'textArea was cleaned');
            gridValues.forEach(value => assert.strictEqual(value, '', 'grid was cleaned'));
            done();
        });

        // Pressing the "Solve" button solves the puzzle and
        // fills in the grid with the solution
        test('Function showSolution(solve(input))', done => {
            const textArea = document.getElementById('text-input');
            const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            textArea.value = input;
            document.getElementById('solve-button').click();
            const gridValues = Array.from(document.querySelectorAll('.sudoku-input')).map(cell => cell.value).join('');
            console.log(gridValues);
            assert.strictEqual(gridValues,solution,'Grid should contain same solution');
            done();
        });
    });
});
