function Gameboard() {
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
  let value = 0;

  const changeValue = (player) => (value = player);
  const getValue = () => value;

  return { changeValue, getValue };
}

const board = Gameboard();
board.getBoard();
board.printBoard();
