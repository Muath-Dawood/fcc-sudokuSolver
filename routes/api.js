'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  function coordinateToIndex(coordinate) {
    // Extract the row letter and column number from the coordinate
    const rowLetter = coordinate[0].toUpperCase();
    const colNumber = parseInt(coordinate[1], 10);
  
    // Convert the row letter to a zero-based row index
    const rowIndex = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  
    // Convert the column number to a zero-based column index
    const colIndex = colNumber - 1;
  
    // Calculate the final index
    const index = rowIndex * 9 + colIndex;
  
    return index;
  }

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check if puzzle, coordinate, or value are missing
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate puzzle length and characters
      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult);
      }

      // Check if coordinate is valid
      const validCoordinates = /^[A-I][1-9]$/;
      if (!validCoordinates.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Check if value is a number between 1 and 9
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Convert coordinate to row and column indices
      const row = coordinate.charAt(0);
      const column = coordinate.charAt(1);

      // Check placement using SudokuSolver methods
      const checkRow = solver.checkRowPlacement(puzzle, row, column, value);
      const checkCol = solver.checkColPlacement(puzzle, row, column, value);
      const checkRegion = solver.checkRegionPlacement(puzzle, row, column, value);
      
      // Determine if placement is valid
      if ((checkRow.valid && checkCol.valid && checkRegion.valid) || puzzle[coordinateToIndex(coordinate)] === value) {
        return res.json({ valid: true });
      } else {
        const conflict = [];
        if (!checkRow.valid) conflict.push(checkRow.conflict);
        if (!checkCol.valid) conflict.push(checkCol.conflict);
        if (!checkRegion.valid) conflict.push(checkRegion.conflict);
        return res.json({ valid: false, conflict });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Check if puzzle is missing
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // Validate puzzle length and characters
      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult);
      }

      // Solve the puzzle using SudokuSolver method
      const solveResult = solver.solve(puzzle);
      if(solveResult) {
        return res.json(solveResult);
      }else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
    });
};
