class App {
  constructor() {
    this.gridSize = 10;
    this.mineCount = 10;
    this.board = [];
    this.revealedCount = 0;

    const restartButton = document.querySelector('#restart');
    const startGameButton = document.querySelector('#btn-start-game');

    // Initialize the Minesweeper game when the start button is clicked
    startGameButton.addEventListener('click', () => {
      this.initGame();
    });

    // Restart the game when the restart button is clicked
    restartButton.addEventListener('click', () => {
      this.initGame();
    });
  }

  // Initialize the game and setup the grid
  initGame() {
    console.log("Initializing game...");

    // Reset the board and revealed cells count
    this.board = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill({ revealed: false, mine: false, flag: false })
    );
    this.revealedCount = 0;
    this.placeMines();
    this.renderBoard();
  }

  // Place mines randomly on the grid
  placeMines() {
    let minesPlaced = 0;
    console.log("Placing mines...");

    while (minesPlaced < this.mineCount) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      
      // Check if this cell already has a mine
      if (!this.board[row][col].mine) {
        this.board[row][col].mine = true;
        minesPlaced++;
        console.log(`Placed mine at row: ${row}, col: ${col}`);
      }
    }
  }

  // Render the grid on the screen
  renderBoard() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid before rendering

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Only show the cell content if it's revealed
        if (this.board[row][col].revealed) {
          if (this.board[row][col].mine) {
            cell.classList.add('mine');
            cell.innerText = '💣'; // Bomb symbol
          } else {
            const adjacentMines = this.countAdjacentMines(row, col);
            if (adjacentMines > 0) {
              cell.innerText = adjacentMines; // Show the number of adjacent bombs
            }
            cell.classList.add('revealed');
          }
        }

        // Handle cell click event to reveal the cell
        cell.onclick = () => this.revealCell(row, col);
        grid.appendChild(cell);
      }
    }
  }

  // Count the number of bombs around a given cell
  countAdjacentMines(row, col) {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    directions.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize && this.board[r][c].mine) {
        count++;
      }
    });
    return count;
  }

  // Handle the logic when a player clicks on a cell
  revealCell(row, col) {
    if (this.board[row][col].revealed || this.board[row][col].flag) return;

    // Reveal the clicked cell
    this.board[row][col].revealed = true;
    this.revealedCount++;

    // If the clicked cell is a mine, show Game Over
    if (this.board[row][col].mine) {
      alert('Game Over!');
      this.revealAll(); // Reveal all cells
    } else if (this.revealedCount === this.gridSize * this.gridSize - this.mineCount) {
      alert('You Win!');
    }

    // If the cell has no adjacent mines, reveal the surrounding cells
    if (this.countAdjacentMines(row, col) === 0) {
      this.revealAdjacentCells(row, col);
    }

    // Re-render the board with updated state
    this.renderBoard();
  }

  // Reveal all adjacent cells around a cell with no adjacent mines
  revealAdjacentCells(row, col) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    directions.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize && !this.board[r][c].revealed && !this.board[r][c].mine) {
        this.board[r][c].revealed = true;
        this.revealedCount++;
        // Recursively reveal adjacent cells if they have no nearby mines
        if (this.countAdjacentMines(r, c) === 0) {
          this.revealAdjacentCells(r, c);
        }
      }
    });
  }

  // Reveal all cells (used when game is over)
  revealAll() {
    this.board.forEach((row) => row.forEach((cell) => (cell.revealed = true)));
    this.renderBoard();
  }
}

new App();
