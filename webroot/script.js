class App {
  constructor() {
    this.board = [];
    this.rows = 8;
    this.columns = 8;
    this.minesCount = 5;
    this.minesLocation = [];
    this.tilesClicked = 0;
    this.flagEnabled = false;
    this.gameOver = false;

    window.onload = () => {
      this.startGame();
    };
  }

  setMines() {
    let minesLeft = this.minesCount;
    while (minesLeft > 0) {
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.columns);
      let id = r.toString() + "-" + c.toString();

      if (!this.minesLocation.includes(id)) {
        this.minesLocation.push(id);
        minesLeft -= 1;
      }
    }
  }

  startGame() {
    document.getElementById("bugs-count").innerText = this.minesCount;
    document.getElementById("broom-button").addEventListener("click", this.setFlag.bind(this));
    this.setMines();

    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let tile = document.createElement("div");
        tile.id = r.toString() + "-" + c.toString();
        tile.classList.add("tile");

        // Use an anonymous function to ensure "this" refers to the clicked tile
        tile.addEventListener("click", (event) => this.clickTile(event));

        document.getElementById("board").append(tile);
        row.push(tile);
      }
      this.board.push(row);
    }
    console.log(this.board);
  }

  setFlag() {
    if (this.flagEnabled) {
      this.flagEnabled = false;
      document.getElementById("broom-button").style.backgroundColor = "lightgray";
    } else {
      this.flagEnabled = true;
      document.getElementById("broom-button").style.backgroundColor = "darkgray";
    }
  }

  clickTile(event) {
    const tile = event.target; // This will refer to the clicked tile

    if (this.gameOver || tile.classList.contains("tile-clicked")) {
      return;
    }

    if (this.flagEnabled) {
      if (tile.innerText == "") {
        tile.innerText = "🧹";
      } else if (tile.innerText == "🧹") {
        tile.innerText = "";
      }
      return;
    }

    if (this.minesLocation.includes(tile.id)) {
      this.gameOver = true;
      this.revealMines();
      return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    this.checkMine(r, c);
  }

  revealMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let tile = this.board[r][c];
        if (this.minesLocation.includes(tile.id)) {
          tile.innerText = "🪳";
          tile.style.backgroundColor = "red";
        }
      }
    }
  }

  checkMine(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.columns) {
      return;
    }

    let tile = this.board[r][c];
    if (tile.classList.contains("tile-clicked")) {
      return;
    }

    tile.classList.add("tile-clicked");
    this.tilesClicked += 1;

    let minesFound = 0;

    minesFound += this.checkTile(r - 1, c - 1);
    minesFound += this.checkTile(r - 1, c);
    minesFound += this.checkTile(r - 1, c + 1);
    minesFound += this.checkTile(r, c - 1);
    minesFound += this.checkTile(r, c + 1);
    minesFound += this.checkTile(r + 1, c - 1);
    minesFound += this.checkTile(r + 1, c);
    minesFound += this.checkTile(r + 1, c + 1);

    if (minesFound > 0) {
      tile.innerText = minesFound;
      tile.classList.add("x" + minesFound.toString());
    } else {
      // If no mines are around, recursively check adjacent tiles
      this.checkMine(r - 1, c - 1);
      this.checkMine(r - 1, c);
      this.checkMine(r - 1, c + 1);
      this.checkMine(r, c - 1);
      this.checkMine(r, c + 1);
      this.checkMine(r + 1, c - 1);
      this.checkMine(r + 1, c);
      this.checkMine(r + 1, c + 1);
    }

    if (this.tilesClicked === this.rows * this.columns - this.minesCount) {
      document.getElementById("bugs-count").innerText = "cleared";
      this.gameOver = true;
    }
  }

  checkTile(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.columns) {
      return 0;
    }
    if (this.minesLocation.includes(r.toString() + "-" + c.toString())) {
      return 1;
    }
    return 0;
  }
}

new App();
