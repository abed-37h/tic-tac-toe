

const createGameboard = () => {
    const board = [];
    
    for (let i = 0; i < 9; i++) {
        board[i] = i + 1;
    }

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
    
    return { getBoard, move, display };
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
    
    const playRound = (position) => {
        const currentPlayer = turnFlipper ? playerX : playerO;
        const result = board.move(position, currentPlayer.getMark());

        if (result) {
            turnFlipper = !turnFlipper; // Flip turn
        }

        display(); // Displays for next round

        return { currentPlayer, result };
    };

    const display = () => {
        console.log(turnFlipper ? 
            `${playerX.getName()}: ${playerX.getMark()}` :
            `${playerO.getName()}: ${playerO.getMark()}`
        );
        board.display();
    }

    display();

    return { playRound };
};

const playGame = (() => {
    const playerXName = prompt('Player One', 'Player One');
    const playerOName = prompt('Player Two', 'Player Two');

    if (!playerXName || !playerOName) {
        console.log('Game cancelled!');
        return;
    }
    
    const game = createGameController(playerXName, playerOName);
    
    while (true) {
        const position = +prompt('Position');
        const { currentPlayer, result } = game.playRound(position);
        
        if (!result) {
            console.log(`Invalid position: ${position}. Play again.\n`);
            continue;
        }
    
        if (result == 'win') {
            console.log(`Hooray! ${currentPlayer.getName()} wins.`);
            break;
        }
    
        console.log(result.toLocaleUpperCase());
    
        if (result == 'draw') {
            break;
        }
    }
})();

