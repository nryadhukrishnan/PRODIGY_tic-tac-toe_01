document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    let playWithComputer = false;
    let computerDifficulty = 'easy';  // Default to easy

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Game mode buttons
    const multiplayerButton = document.getElementById('multiplayer');
    const computerButton = document.getElementById('computer');
    const difficultyDiv = document.getElementById('difficulty');

    const easyButton = document.getElementById('easy');
    const mediumButton = document.getElementById('medium');
    const hardButton = document.getElementById('hard');

    multiplayerButton.addEventListener('click', () => {
        resetGame();
        playWithComputer = false;
        difficultyDiv.style.display = 'none';  // Hide difficulty selection
        statusDisplay.textContent = "Multiplayer mode: Player X's turn";
    });

    computerButton.addEventListener('click', () => {
        resetGame();
        playWithComputer = true;
        difficultyDiv.style.display = 'block';  // Show difficulty selection
        statusDisplay.textContent = "Computer mode: Player X's turn";
    });

    easyButton.addEventListener('click', () => {
        computerDifficulty = 'easy';
        resetGame();
        statusDisplay.textContent = "Computer mode (Easy): Player X's turn";
    });

    mediumButton.addEventListener('click', () => {
        computerDifficulty = 'medium';
        resetGame();
        statusDisplay.textContent = "Computer mode (Medium): Player X's turn";
    });

    hardButton.addEventListener('click', () => {
        computerDifficulty = 'hard';
        resetGame();
        statusDisplay.textContent = "Computer mode (Hard): Player X's turn";
    });

    // Add event listener for restart button
    restartButton.addEventListener('click', resetGame);

    // Function to handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;

        checkResult();

        if (playWithComputer && currentPlayer === 'X' && gameActive) {
            setTimeout(computerMove, 500);  // Simulate a computer move after a short delay
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }

    // Function for computer's move based on difficulty level
    function computerMove() {
        if (computerDifficulty === 'easy') {
            randomMove();
        } else if (computerDifficulty === 'medium') {
            if (!tryWinningMove()) {
                randomMove();
            }
        } else if (computerDifficulty === 'hard') {
            minimaxMove();
        }

        checkResult();
        if (gameActive) {
            currentPlayer = 'X';
            updateStatus();
        }
    }

    // Easy: Random move
    function randomMove() {
        let availableMoves = board.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        if (randomMove !== undefined) {
            board[randomMove] = 'O';
            cells[randomMove].textContent = 'O';
        }
    }

    // Medium: Try to win or block, otherwise random move
    function tryWinningMove() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
                board[c] = 'O';
                cells[c].textContent = 'O';
                return true;
            }
            if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
                board[c] = 'O';
                cells[c].textContent = 'O';
                return true;
            }
        }
        return false;
    }

    // Hard: Minimax algorithm for optimal moves
    function minimaxMove() {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        board[move] = 'O';
        cells[move].textContent = 'O';
    }

    const scores = {
        O: 1,
        X: -1,
        tie: 0
    };

    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner();
        if (winner !== null) {
            return scores[winner];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes('')) return 'tie';
        return null;
    }

    // Function to check the result (win, draw, continue)
    function checkResult() {
        const winner = checkWinner();
        if (winner !== null) {
            if (winner === 'tie') {
                statusDisplay.textContent = 'Game is a draw!';
            } else {
                statusDisplay.textContent = `Player ${winner} has won!`;
            }
            gameActive = false;
            return;
        }
        updateStatus();
    }

    // Update status message based on the current player
    function updateStatus() {
        if (gameActive) {
            statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
        }
    }

    // Reset the game board
    function resetGame() {
        board.fill('');
        gameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
        });
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    }

    // Event listeners for cell clicks
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
});
