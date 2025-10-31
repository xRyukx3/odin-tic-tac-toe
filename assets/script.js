function createGameboard() {
  const rows = 3;
  const columns = 3;

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

function GameControl() {
  const players = [createPlayer("David", "X"), createPlayer("Josue", "O")];
  const gameboard = createGameboard();
  let currentPlayerIndex = 0;
  const switchTurn = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };
  const markBoard = (row, col, symbol) => {
    gameboard
      .getBoard()
      [row][col].setValue(players[currentPlayerIndex].getSymbol());
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
    let status;
    let winner;
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
      ticTacToePositions = checkRowsAndColumns(board, symbol);
      winner = currentPlayer.getName();
      status = "win";
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

game = GameControl();
game.gameboard.printBoard();
