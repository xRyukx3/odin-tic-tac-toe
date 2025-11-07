/* UI Section */

const displayController = (function () {
  const gameContainer = document.querySelector(".game-container");

  function createGrid(rows, columns) {
    const board = document.createElement("table");
    board.className = "grid";
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < columns; j++) {
        const td = document.createElement("td");
        td.className = "cell";
        td.dataset.row = i;
        td.dataset.column = j;
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
    gameContainer.appendChild(board);
  }

  function updateDisplay(board) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cellElement) => {
      const row = parseInt(cellElement.dataset.row);
      const column = parseInt(cellElement.dataset.column);
      cellElement.textContent = board[row][column].getValue();
    });
  }

  return { createGrid, updateDisplay };
})();

/* Game Logic Section */

function createGameboard(rows, columns) {
  //Using IIFE to initialize the board variable
  //this keeps the Gameboard scope clean
  const board = (function () {
    const array = [];
    for (let i = 0; i < rows; i++) {
      array[i] = [];
      for (let j = 0; j < columns; j++) {
        array[i].push(Cell());
      }
    }
    return array;
  })();

  const getBoard = () => board;
  const printBoard = () => {
    const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardValues);
  };

  return { getBoard, printBoard };
}

function Cell() {
  let value = null;

  const setValue = (player) => (value = player);
  const getValue = () => value;

  return { setValue, getValue };
}

function createPlayer(name, symbol) {
  let _name = name;
  let _symbol = symbol;
  let score = 0;

  const getName = () => _name;
  const getSymbol = () => _symbol;
  const getScore = () => score;
  const incrementScore = () => score++;

  return { getName, getSymbol, getScore, incrementScore };
}

function GameControl(
  boardSize = 3,
  players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")]
) {
  console.log(players);
  const gameboard = createGameboard(boardSize, boardSize);
  displayController.createGrid(boardSize, boardSize);
  displayController.updateDisplay(gameboard.getBoard());

  let currentPlayerIndex = 0;
  const switchTurn = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const markBoard = (row, col) => {
    const boardCell = gameboard.getBoard()[row][col];
    const symbol = players[currentPlayerIndex].getSymbol();
    if (boardCell.getValue() === null) {
      boardCell.setValue(symbol);
      return true;
    } else {
      return false;
    }
  };

  //Helper functions to check
  const checkRowsAndColumns = (board, symbol) => {
    const N = board.length;
    for (let i = 0; i < N; i++) {
      let rowPositions = [];
      let colPositions = [];
      let rowCount = 0;
      let colCount = 0;
      for (let j = 0; j < N; j++) {
        if (board[i][j].getValue() === symbol) {
          rowPositions.push([i, j]);
          rowCount++;
        }
        if (board[j][i].getValue() === symbol) {
          colPositions.push([j, i]);
          colCount++;
        }
      }
      if (rowCount === N) return rowPositions;
      if (colCount === N) return colPositions;
    }
    return null;
  };
  const checkDiagonals = (board, symbol) => {
    const N = board.length;
    let positiveSlopePositions = [];
    let negativeSlopePositions = [];
    let positiveSlopeCount = 0;
    let negativeSlopeCount = 0;
    for (let i = 0; i < N; i++) {
      if (board[i][i].getValue() === symbol) {
        positiveSlopePositions.push([i, i]);
        positiveSlopeCount++;
      }
      if (board[i][N - 1 - i].getValue() === symbol) {
        negativeSlopePositions.push([i, N - 1 - i]);
        negativeSlopeCount++;
      }
    }
    if (positiveSlopeCount === N) return positiveSlopePositions;
    if (negativeSlopeCount === N) return negativeSlopePositions;

    return null;
  };
  const checkTie = (board) => {
    const N = board.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j].getValue() === null) return false;
      }
    }
    return true;
  };

  const checkTicTacToe = () => {
    const board = gameboard.getBoard();
    const currentPlayer = players[currentPlayerIndex];
    const symbol = currentPlayer.getSymbol();
    let ticTacToePositions = [];

    if (checkRowsAndColumns(board, symbol)) {
      ticTacToePositions = checkRowsAndColumns(board, symbol);
      winner = currentPlayer.getName();
      return {
        status: "win",
        winner: currentPlayer.getName(),
        positions: ticTacToePositions,
      };
    } else if (checkDiagonals(board, symbol)) {
      ticTacToePositions = checkDiagonals(board, symbol);
      winner = currentPlayer.getName();
      return {
        status: "win",
        winner: currentPlayer.getName(),
        positions: ticTacToePositions,
      };
    } else if (checkTie(board)) {
      return { status: "tie" };
    } else {
      return { status: "continue" };
    }
  };

  return { players, gameboard, switchTurn, markBoard, checkTicTacToe };
}

const initGame = () => {
  const playersInformationForm = document.querySelector(".player-information");
  let players = [];
  playersInformationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const player1Name = document.getElementById("player-1-name");
    const player2Name = document.getElementById("player-2-name");
    const player1Mark = document.getElementById("player-1-mark");
    const player2Mark = document.getElementById("player-2-mark");
    players = [
      createPlayer(player1Name.value, player1Mark.value),
      createPlayer(player2Name.value, player2Mark.value),
    ];
    const play = GameControl(3, players);
    let status = "continue";
    const board = document.querySelector(".grid");

    board.addEventListener("click", (e) => {
      const row = parseInt(e.target.dataset.row);
      const column = parseInt(e.target.dataset.column);
      if (status === "continue") {
        if (e.target.classList.contains("cell")) {
          if (play.markBoard(row, column)) {
            displayController.updateDisplay(play.gameboard.getBoard());
            status = play.checkTicTacToe().status;
            console.log(status);
            play.switchTurn();
            play.gameboard.printBoard();
          }
        } else {
          return;
        }
      }
    });
  });
};

/* */

initGame();
