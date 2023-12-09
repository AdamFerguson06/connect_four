def create_board():
    """Create a 6x7 Connect Four board."""
    return [[0 for _ in range(7)] for _ in range(6)]

def print_board(board):
    """Print the game board."""
    for row in board:
        print(' '.join(str(cell) for cell in row))
    print("---" * 7)  # Divider

def is_valid_location(board, column):
    """Check if the column selection is valid."""
    return board[0][column] == 0

def drop_piece(board, column, piece):
    """Drop a piece in the chosen column."""
    for row in reversed(board):
        if row[column] == 0:
            row[column] = piece
            return True
    return False  # Column is full

def check_horizontal(board, piece):
    """Check horizontal win condition."""
    for row in board:
        for col in range(4):
            if row[col] == piece and row[col + 1] == piece and row[col + 2] == piece and row[col + 3] == piece:
                return True
    return False

def check_vertical(board, piece):
    """Check vertical win condition."""
    for col in range(7):
        for row in range(3):
            if board[row][col] == piece and board[row + 1][col] == piece and board[row + 2][col] == piece and board[row + 3][col] == piece:
                return True
    return False

def check_diagonals(board, piece):
    """Check diagonal win conditions."""
    # Check for positive slope diagonals
    for col in range(4):
        for row in range(3, 6):
            if board[row][col] == piece and board[row - 1][col + 1] == piece and board[row - 2][col + 2] == piece and board[row - 3][col + 3] == piece:
                return True

    # Check for negative slope diagonals
    for col in range(4):
        for row in range(3):
            if board[row][col] == piece and board[row + 1][col + 1] == piece and board[row + 2][col + 2] == piece and board[row + 3][col + 3] == piece:
                return True

    return False

def check_win(board, piece):
    """Check if the given piece has a winning condition."""
    return check_horizontal(board, piece) or check_vertical(board, piece) or check_diagonals(board, piece)
