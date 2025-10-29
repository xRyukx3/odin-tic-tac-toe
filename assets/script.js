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

  const setValue = (player) => (value = player);
  const getValue = () => value;

  return { setValue, getValue };
}

function Player(_name) {
  const _name = "player";
  const score = 0;

  const setName = (name) => (_name = name);
  const getName = () => _name;
  const getScore = () => score;
  const incrementScore = () => score++;

  return { setName, getName, getScore, incrementScore };
}

const board = Gameboard();
board.getBoard();
board.printBoard();
