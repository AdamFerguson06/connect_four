from flask import Flask, render_template, request, jsonify
import connect_four  # Make sure to include your game logic in connect_four.py

app = Flask(__name__)

# Initialize game state
game_state = connect_four.create_board()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def make_move():
    data = request.json
    column = int(data['column'])
    player = int(data['player'])

    # Update the game state with the new move
    if connect_four.is_valid_location(game_state, column):
        connect_four.drop_piece(game_state, column, player)

        # Check for win
        if connect_four.check_win(game_state, player):
            response = {'status': 'win', 'message': f'Player {player} wins!'}
        else:
            response = {'status': 'success', 'message': 'Move processed'}
    else:
        response = {'status': 'error', 'message': 'Invalid move'}

    return jsonify(response)

@app.route('/reset', methods=['GET'])
def reset_game():
    global game_state
    game_state = connect_four.create_board()
    return jsonify({'status': 'success', 'message': 'Game reset'})

if __name__ == '__main__':
    app.run(debug=True)
