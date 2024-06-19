class SudokuSolver {

  validate(puzzleString) {
    // Check if puzzleString has exactly 81 characters
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    // Check if puzzleString contains only valid characters (1-9 and '.')
    if (!/^[1-9\.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = 'ABCDEFGHI'.indexOf(row);
    const start = rowIndex * 9;
    const end = start + 9;
    const rowValues = puzzleString.slice(start, end).split('');

    // Check if the value is already in the row
    if (rowValues.includes(value)) {
      return { valid: false, conflict: 'row' };
    }

    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = parseInt(column) - 1;
    let colValues = [];

    // Extract values from the column
    for (let i = colIndex; i < 81; i += 9) {
      colValues.push(puzzleString[i]);
    }

    // Check if the value is already in the column
    if (colValues.includes(value)) {
      return { valid: false, conflict: 'column' };
    }

    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = 'ABCDEFGHI'.indexOf(row);
    const colIndex = parseInt(column) - 1;
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
    const regionValues = [];

    // Extract values from the 3x3 region
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        const index = i * 9 + j;
        regionValues.push(puzzleString[index]);
      }
    }

    // Check if the value is already in the region
    if (regionValues.includes(value)) {
      return { valid: false, conflict: 'region' };
    }

    return { valid: true };
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString).valid) {
      return { error: 'Puzzle cannot be solved' };
    }

    const board = puzzleString.split('');
    if (this.solveSudoku(board)) {
      const solution = board.join('');
      return { solution };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }

  solveSudoku(board) {
    const emptyCell = this.findEmptyCell(board);
    if (!emptyCell) {
      return true; // Puzzle solved
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      const numStr = num.toString();
      if (this.isSafe(board, row, col, numStr)) {
        board[row * 9 + col] = numStr;
        if (this.solveSudoku(board)) {
          return true;
        }
        board[row * 9 + col] = '.'; // Backtrack
      }
    }
    return false; // No valid solution found
  }

  findEmptyCell(board) {
    for (let i = 0; i < 81; i++) {
      if (board[i] === '.') {
        return [Math.floor(i / 9), i % 9];
      }
    }
    return null; // No empty cell found
  }

  isSafe(board, row, col, num) {
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;

    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (board[row * 9 + i] === num || board[i * 9 + col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[(rowStart + i) * 9 + colStart + j] === num) {
          return false;
        }
      }
    }

    return true; // Placement is safe
  }
}

module.exports = SudokuSolver;
