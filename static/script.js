// JavaScript to handle Connect Four game interactions and communicate with Flask backend

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    let currentPlayer = 1;  // Starting with Player 1
    let gameIsOver = false;  // Flag to track if the game is over

    // Function to initialize the game board
    function initializeBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.classList.add('gameCell');
                cell.dataset.row = row;
                cell.dataset.column = col;
                gameBoard.appendChild(cell);
            }
        }
        currentPlayer = 1;  // Reset to Player 1 when initializing
        gameIsOver = false;  // Reset game over flag
    }

    // Function to update the game board based on the move
    function updateBoard(column, player) {
        for (let row = 5; row >= 0; row--) {
            let cell = document.querySelector(`.gameCell[data-row='${row}'][data-column='${column}']`);
            if (!cell.classList.contains('player1') && !cell.classList.contains('player2')) {
                cell.classList.add(player === 1 ? 'player1' : 'player2');
                break;
            }
        }
    }

    // Function to handle a player's move
    function handleMove(column) {
        if (gameIsOver) {
            alert('Game is already over. Please restart to play again.');
            return;
        }

        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column: column, player: currentPlayer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' || data.status === 'win') {
                updateBoard(column, currentPlayer);
                if (data.status === 'win') {
                    setTimeout(() => {
                        alert(data.message);  // Alerting the win after the board is updated
                        gameIsOver = true;  // Set the game as over
                    }, 100);  // Short delay
                } else {
                    togglePlayer();  // Toggle to the next player after a successful move
                }
            } else {
                console.error('Error processing move:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to toggle the current player
    function togglePlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    // Event listener for game cell clicks
    gameBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('gameCell')) {
            const column = e.target.dataset.column;
            handleMove(column);
        }
    });

    // Event listener for the restart button
    restartButton.addEventListener('click', () => {
        fetch('/reset', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                initializeBoard();
            } else {
                console.error('Error resetting game:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    initializeBoard(); // Set up the initial game board
});
