/* UI Section */
const gameContainer = document.querySelector(".game-container");

const displayController = (function () {
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

  function createButtonControls() {
    const newGameButton = document.createElement("button");
    newGameButton.className = "control new-game-button";
    newGameButton.textContent = "NEW GAME";
    const restartGameButton = document.createElement("button");
    restartGameButton.className = "control restart-game-button";
    restartGameButton.textContent = "RESTART";
    gameContainer.appendChild(newGameButton);
    gameContainer.appendChild(restartGameButton);
  }

  function removeButtonControls() {
    const buttons = document.querySelectorAll(".control");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
    }
  }

  function createPlayersBoard(players) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < players.length; i++) {
      const playerInformation = document.createElement("div");
      playerInformation.className = "player";
      playerInformation.dataset.index = i;
      const playerName = document.createElement("p");
      playerName.className = "name";
      playerName.textContent = `Name: ${players[i].getName()}`;

      const playerMark = document.createElement("p");
      playerMark.className = "mark";
      playerMark.textContent = `Mark: ${players[i].getSymbol()}`;

      const playerScore = document.createElement("p");
      playerScore.className = "score";
      playerScore.textContent = `Score: ${players[i].getScore()}`;

      playerInformation.appendChild(playerName);
      playerInformation.appendChild(playerMark);
      playerInformation.appendChild(playerScore);
      fragment.appendChild(playerInformation);
    }
    gameContainer.appendChild(fragment);
  }

  function removePlayersBoard() {
    const players = document.querySelectorAll(".player");
    for (let i = 0; i < players.length; i++) {
      players[i].remove();
    }
  }

  function updatePlayersBoard(players) {
    for (let i = 0; i < players.length; i++) {
      const playerName = document.querySelector(
        `.player[data-index="${i}"] .name`
      );
      const playerMark = document.querySelector(
        `.player[data-index="${i}"] .mark`
      );
      const playerScore = document.querySelector(
        `.player[data-index="${i}"] .score`
      );
      playerName.textContent = `Name: ${players[i].getName()}`;
      playerMark.textContent = `Mark: ${players[i].getSymbol()}`;
      playerScore.textContent = `Score: ${players[i].getScore()}`;
    }
  }

  function updateDisplay(board) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cellElement) => {
      const row = parseInt(cellElement.dataset.row);
      const column = parseInt(cellElement.dataset.column);
      cellElement.textContent = board[row][column].getValue();
    });
  }

  function createResultDisplay(result) {
    const resultDisplay = document.createElement("p");
    resultDisplay.className = "result";
    resultDisplay.innerHTML = result;
    gameContainer.appendChild(resultDisplay);
  }

  return {
    createGrid,
    updateDisplay,
    createPlayersBoard,
    updatePlayersBoard,
    removePlayersBoard,
    createButtonControls,
    removeButtonControls,
    createResultDisplay,
  };
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
  const cleanBoard = () => {
    const boardValues = board.map((row) =>
      row.map((cell) => cell.setDefault())
    );
    console.log(boardValues);
  };

  return { getBoard, printBoard, cleanBoard };
}

function Cell() {
  let value = null;

  const setValue = (player) => (value = player);
  const getValue = () => value;
  const setDefault = () => (value = null);

  return { setValue, getValue, setDefault };
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

    const winningPositions =
      checkRowsAndColumns(board, symbol) || checkDiagonals(board, symbol);

    if (winningPositions) {
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

  return {
    players,
    gameboard,
    currentPlayerIndex,
    switchTurn,
    markBoard,
    checkTicTacToe,
  };
}

const initGame = () => {
  const playersInformationDialog = document.querySelector(
    ".player-information-dialog"
  );
  const playersInformationForm = document.querySelector(
    ".player-information-form"
  );
  let players = [];
  const showDialogButton = document.querySelector(".start-button");

  showDialogButton.addEventListener("click", () => {
    playersInformationDialog.showModal();
  });

  playersInformationForm.addEventListener("submit", (e) => {
    showDialogButton.style.display = "none";
    playersInformationDialog.close();
    e.preventDefault();
    const player1Name = document.getElementById("player-1-name");
    const player2Name = document.getElementById("player-2-name");
    const player1Mark = document.getElementById("player-1-mark");
    const player2Mark = document.getElementById("player-2-mark");
    players = [
      createPlayer(player1Name.value, player1Mark.value),
      createPlayer(player2Name.value, player2Mark.value),
    ];
    if (document.querySelector(".grid")) {
      const previousGamboard = document.querySelector(".grid");
      previousGamboard.remove();
    }
    const play = GameControl(3, players);
    let status = "continue";
    const board = document.querySelector(".grid");

    displayController.createButtonControls();
    displayController.createPlayersBoard(play.players);

    board.addEventListener("click", (e) => {
      const row = parseInt(e.target.dataset.row);
      const column = parseInt(e.target.dataset.column);
      if (status === "continue") {
        if (e.target.classList.contains("cell")) {
          if (play.markBoard(row, column)) {
            displayController.updateDisplay(play.gameboard.getBoard());
            status = play.checkTicTacToe().status;
            console.log(status);
            if (status === "continue") {
              play.switchTurn();
            } else if (status === "win") {
              const winner = play.checkTicTacToe().winner;
              const indexWinner = play.players.findIndex(
                (player) => player.getName() === winner
              );
              if (indexWinner !== false) {
                displayController.createResultDisplay(
                  `${play.players[indexWinner].getName()} wins`
                );
                console.log(indexWinner);
                play.players[indexWinner].incrementScore();
                displayController.updatePlayersBoard(play.players);
              }
              board.style.pointerEvents = "none";
              play.currentPlayerIndex = 0;
            } else if (status === "tie") {
              displayController.createResultDisplay("It's a tie!");
              play.currentPlayerIndex = 0;
            }
            play.gameboard.printBoard();
          }
        }
      }
    });

    const newGameButton = document.querySelector(".new-game-button");
    newGameButton.addEventListener("click", () => {
      if (document.querySelector(".result")) {
        const result = document.querySelector(".result");
        result.remove();
      }
      play.gameboard.cleanBoard();
      displayController.updateDisplay(play.gameboard.getBoard());
      status = "continue";
      board.style.pointerEvents = "auto";
    });

    const restartGameButton = document.querySelector(".restart-game-button");
    restartGameButton.addEventListener("click", () => {
      if (document.querySelector(".result")) {
        const result = document.querySelector(".result");
        result.remove();
      }
      playersInformationForm.reset();
      displayController.removeButtonControls();
      displayController.removePlayersBoard();
      playersInformationDialog.showModal();
    });
  });
};

initGame();
