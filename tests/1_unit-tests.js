const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

suite('Unit Tests', () => {

  // Test cases for puzzle validation
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzle);
    assert.property(result, 'valid');
    assert.isTrue(result.valid);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..B..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '123456789..........';
    const result = solver.validate(puzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  // Test cases for row placement
  test('Logic handles a valid row placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkRowPlacement(puzzle, 'A', '1', '5');
    assert.isTrue(result.valid);
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkRowPlacement(puzzle, 'A', '1', '8');
    assert.isFalse(result.valid);
    assert.equal(result.conflict, 'row');
  });

  // Test cases for column placement
  test('Logic handles a valid column placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkColPlacement(puzzle, 'A', '1', '2');
    assert.isTrue(result.valid);
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkColPlacement(puzzle, 'A', '1', '8');
    assert.isFalse(result.valid);
    assert.equal(result.conflict, 'column');
  });

  // Test cases for region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkRegionPlacement(puzzle, 'A', '3', '3');
    assert.isTrue(result.valid);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.checkRegionPlacement(puzzle, 'A', '3', '8');
    assert.isFalse(result.valid);
    assert.deepEqual(result.conflict, 'region');
  });

  // Test cases for solver
  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution.length, 81);
    assert.equal(result.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651')
    // Validate if solution is correct (not fully implemented here)
    // Additional checks can be added based on the specific puzzle solved
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '.7.89.....5....3.4.2..4..1.5S89..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
    const result = solver.solve(puzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Puzzle cannot be solved');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
  });

});
