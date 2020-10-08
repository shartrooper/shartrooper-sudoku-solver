/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
let Solver;

suite('UnitTests', () => {
    suiteSetup(() => {
        // Mock the DOM for testing and load Solver
        return JSDOM.fromFile('./views/index.html', {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then(dom => {
            global.window = dom.window;
            global.document = dom.window.document;
            Solver = require('../public/sudoku-solver');
        });
    });
    // Only the digits 1-9 are accepted
    // as valid input for the puzzle grid
    suite('Function checkLegitInput(input)', () => {
        test('Valid "1-9" characters', (done) => {
            const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            input.forEach((el, i) => {
                assert.strictEqual(Solver.checkLegitInput(el), input[i]);
            });
            done();
        });

        // Invalid characters or numbers are not accepted
        // as valid input for the puzzle grid
        test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
            const input = ['!', 'a', '/', '+', '-', '0', 'v', 0, '.'];
            input.forEach((el, i) => {
                assert.strictEqual(Solver.checkLegitInput(el), ".");
            });
            done();
        });
    });

    suite('Function solvePuzzle() and createTwoDimensionalArray(input)', () => {
        test('Parses a valid puzzle string into an object', done => {
            const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const output = [
                [
                    ".",
                    ".",
                    "9",
                    ".",
                    ".",
                    "5",
                    ".",
                    "1",
                    "."
                ],
                [
                    "8",
                    "5",
                    ".",
                    "4",
                    ".",
                    ".",
                    ".",
                    ".",
                    "2"
                ],
                [
                    "4",
                    "3",
                    "2",
                    ".",
                    ".",
                    ".",
                    ".",
                    ".",
                    "."
                ],
                [
                    "1",
                    ".",
                    ".",
                    ".",
                    "6",
                    "9",
                    ".",
                    "8",
                    "3"
                ],
                [
                    ".",
                    "9",
                    ".",
                    ".",
                    ".",
                    ".",
                    ".",
                    "6",
                    "."
                ],
                [
                    "6",
                    "2",
                    ".",
                    "7",
                    "1",
                    ".",
                    ".",
                    ".",
                    "9"
                ],
                [
                    ".",
                    ".",
                    ".",
                    ".",
                    ".",
                    ".",
                    "1",
                    "9",
                    "4"
                ],
                [
                    "5",
                    ".",
                    ".",
                    ".",
                    ".",
                    "4",
                    ".",
                    "3",
                    "7"
                ],
                [
                    ".",
                    "4",
                    ".",
                    "3",
                    ".",
                    ".",
                    "6",
                    ".",
                    "."
                ]
            ];

            assert.deepStrictEqual(Solver.createTwoDimensionalArray(input), output);
            done();
        });

        // Puzzles that are not 81 numbers/periods long show the message
        // "Error: Expected puzzle to be 81 characters long." in the
        // `div` with the id "error-msg"
        test('Shows an error for puzzles that are not 81 numbers long', done => {
            const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
            const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
            const errorDiv = document.getElementById('error-msg');
            const textArea = document.getElementById('text-input');
            textArea.value = shortStr;
            //Trigger click event
            document.getElementById('solve-button').click();
            assert.equal(errorDiv.innerText, errorMsg, 'errorDiv should contain Error text');
            assert.equal(errorDiv.style.visibility, 'visible', 'erroDiv should be a visible element');
            // Change back to long string and the error should remain. Start by resetting the value of errorDiv to confirm a positive result
            errorDiv.innerText = '';
            textArea.value = longStr;
            document.getElementById('solve-button').click();
            assert.equal(errorDiv.innerText, errorMsg);
            done();
        });
    });

    suite('Function solvePuzzle() and checkSolvable()', () => {
        // Valid complete puzzles pass
        test('Valid puzzles pass', done => {
            const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
            const errorDiv = document.getElementById('error-msg');
            const textArea = document.getElementById('text-input');
            textArea.value = input;
            document.getElementById('solve-button').click();
            assert.equal(errorDiv.innerText, '', 'errorDiv should have not text');
            assert.equal(errorDiv.style.visibility, 'hidden', 'erroDiv should not be a visible element');
            done();
        });

        // Invalid complete puzzles fail
        test('Invalid puzzles fail', done => {
            const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
            const errorDiv = document.getElementById('error-msg');
            const errorMsg = 'Error: No solution.';
            const textArea = document.getElementById('text-input');
            textArea.value = input;
            document.getElementById('solve-button').click();
            assert.equal(errorDiv.innerText, errorMsg, 'errorDiv should contain No Solution text');
            assert.equal(errorDiv.style.visibility, 'visible', 'errorDiv should be a visible element');
            done();
        });
    });

    suite('Function solvePuzzle() and findSolution()', () => {
        // Returns the expected solution for a valid, incomplete puzzle
        test('Returns the expected solution for an incomplete puzzle', done => {
            const textArea = document.getElementById('text-input');
            const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            textArea.value = input;
            document.getElementById('solve-button').click();
            assert.equal(textArea.value, solution, 'textArea should contain the solution returned')
            done();
        });
    });
});
