

const createGameboard = () => {
    const board = [];
    
    const reset = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = i + 1;
        }
    };

    const getBoard = () => board;
    
    const move = (position, mark) => {
        mark = mark.toUpperCase();

        if (!validMove(position)) {
            return null;
        }

        board[position - 1] = mark;

        if (winMove(position)) {
            return 'win';
        }

        if (full()) {
            return 'draw';
        }

        return 'ongoing';
    };
    
    const validMove = (position) => position > 0 && position < 10 && Number.isInteger(board[position - 1]);

    const winMove = (position) => {
        const x = Math.floor((position - 1) / 3);
        const y = (position - 1) % 3;

        return (
            board[3 * x] == board[3 * x + 1] && board[3 * x] == board[3 * x + 2]    // Horizontal
            || board[y] == board[y + 3] && board[y] == board[y + 6]                 // Vertical
            || x == y && board[0] == board[4] && board[4] == board[8]               // First Diagonal
            || x + y == 2 && board[2] == board[4] && board[4] == board[6]           // Second Diagonal
        );
    };

    const full = () => board.every(mark => mark == 'X' || mark == 'O');

    const display = () => {
        console.log(`
            ${board[0]} | ${board[1]} | ${board[2]}
            ---------
            ${board[3]} | ${board[4]} | ${board[5]}
            ---------
            ${board[6]} | ${board[7]} | ${board[8]}
        `);
    };
    
    reset();
    
    return { reset, getBoard, move, display };
};

const createPlayer = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
};

const createGameController = (playerXName = 'Player One', playerOName = 'Player Two') => {
    const board = createGameboard();

    const playerX = createPlayer(playerXName, 'X');
    const playerO = createPlayer(playerOName, 'O');

    let turnFlipper = true; // true for playerX and false for playerO

    const reset = () => {
        turnFlipper = true;
        board.reset();
    }

    const getCurrentPlayer = () => turnFlipper ? playerX : playerO;
    
    const playRound = (position) => {
        const currentPlayer = getCurrentPlayer()
        const result = board.move(position, currentPlayer.getMark());

        if (result) {
            turnFlipper = !turnFlipper; // Flip turn
        }

        display(); // Displays for next round

        return result;
    };

    const display = () => {
        console.log(`${getCurrentPlayer().getName()}: ${getCurrentPlayer().getMark()}`);
        board.display();
    }

    display();

    return { getCurrentPlayer, playRound, reset, getBoard: board.getBoard };
};

const displayController = (playerXName, playerOName) => {
    const game = createGameController(playerXName, playerOName);

    let gameOver = false;
    
    const playerXDisplay = document.querySelector('#x');
    const playerODisplay = document.querySelector('#o');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.querySelector('.restart-button');
    const resultDialog = document.querySelector('#result-dialog');

    playerXDisplay.textContent = playerXName;
    playerODisplay.textContent = playerOName;

    const updateDisplay = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        document.querySelectorAll('.player').forEach(player => player.classList.remove('highlight'));
        document.querySelector(`#${currentPlayer.getMark().toLowerCase()}`).classList.add('highlight');
    
        board.forEach((cell) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.classList.add('chalk-font');
            cellButton.textContent = Number.isInteger(cell) ? '' : cell;
            cellButton.dataset.position = cell;
            boardDiv.appendChild(cellButton);
        });
    };

    const displayGameOver = (message) => {
        resultDialog.querySelector('.result').textContent = message;
        resultDialog.showModal();
        gameOver = true;
    }

    boardDiv.addEventListener('click', (event) => {
        if (gameOver) {
            return;
        }

        const position = event.target.dataset.position;
        const currentPlayer = game.getCurrentPlayer();

        if (!position) {
            return;
        }

        const result = game.playRound(position);
        
        updateDisplay();

        if (result === 'win') {
            displayGameOver(`Hooray! ${currentPlayer.getName()} wins.`);
        }
        else if (result === 'draw') {
            displayGameOver('Draw');
        }
    });

    restartButton.addEventListener('click', () => {
        gameOver = false;
        game.reset();
        updateDisplay();
    });

    resultDialog.querySelector('.restart-button').addEventListener('click', () => {
        resultDialog.close();
    });

    updateDisplay();
};

const setGame = (() => {
    const setNamesDialog = document.querySelector('#set-names-dialog');
    const setNamesForm = document.querySelector('#set-names-form');
    const resetNamesButton = document.querySelector('.reset-names-button');

    setNamesDialog.showModal();

    setNamesForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setNamesDialog.close();

        const data = new FormData(event.target);

        const playerXName = data.get('player-x') ? data.get('player-x') : 'Player One';
        const playerOName = data.get('player-o') ? data.get('player-o') : 'Player Two';

        displayController(playerXName, playerOName);
    });

    resetNamesButton.addEventListener('click', () => {
        setNamesDialog.showModal();
    });
})();

