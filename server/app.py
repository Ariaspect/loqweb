from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

from loq0 import Game

from typing import List

app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysafepassword'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def index():
    return "Test index"


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(f"client{{{ request.sid }}} has connected")
    # emit("connected", {"id": request.sid})


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print(f"client{{{ request.sid }}} has disconnected")
    emit("disconnected", {"id": request.sid}, broadcast=True)


"""room events"""


class Room:
    player: List[str]
    ready: int
    turn: bool
    # spectators: List[str]
    game: Game

    def __init__(self):
        self.player = ["", ""]
        self.ready = 0
        self.turn = False
        # self.spectators = []
        self.game = Game()

    def __json__(self):
        return {
            "player0": self.player[0],
            "player1": self.player[1],
        }
    # def __str__(self):
    #     return f"{self.player0} vs {self.player1}\n{self.game}"

rooms = {str(_+1): Room() for _ in range(5)}

def get_player(roomId, id):
    return rooms[roomId].player.index(id) if id in rooms[roomId].player else -1


@socketio.on("room: join")
def join(roomId):
    """event listener when client joins room"""
    join_room(roomId)
    log = f"client{{{ request.sid }}} has joined room {roomId}"
    print(log)
    emit("server_message", log, to=roomId)
    emit("room_info", rooms[roomId].__json__(), to=request.sid)


@socketio.on("room: leave")
def leave(roomId):
    """event listener when client leaves room"""
    leave_room(roomId)
    log = f"client{{{ request.sid }}} has left room {roomId}"
    print(log)
    emit("server_message", log, to=roomId)
    if (player := get_player(roomId, request.sid)) != -1:
        rooms[roomId].player[player] = ""
        emit("room_info", rooms[roomId].__json__(), to=roomId)


@socketio.on("room: player")
def room_player(data):
    roomId = data['roomId']
    player = data['player']
    user = data['user']
    log = f"room{roomId}.player{player} is {f'client{{{ user }}}' if user else 'empty'}"
    rooms[roomId].player[player] = data['user']
    emit("room_info", rooms[roomId].__json__(), to=roomId)
    emit("server_message", log, to=roomId)



@socketio.on("game: ready")
def game_ready(roomId):
    rooms[roomId].ready += 1
    print(f"game ready[{rooms[roomId].ready}] on room {roomId}")
    if rooms[roomId].ready >= 2:
        rooms[roomId].ready = 0
        log = f"game start: {{{rooms[roomId].player[0]}}} vs {{{rooms[roomId].player[1]}}}"
        emit("game_start", to=roomId)
        emit("server_message", log, to=roomId)
        emit("game_board", str(rooms[roomId].game).split('\n'), to=roomId)
        emit("game_turn", rooms[roomId].turn, to=roomId)


@socketio.on("game: act")
def game_act(data):
    roomId = data['roomId']
    move = data['act']
    
    room = rooms[roomId]
    game_copy = Game(room.game.st.st, room.game.acts.copy())
    act_res = game_copy.act(*move.values())
    
    if act_res is None or act_res is False:  # invalid move
        log = f"invalid action by player{get_player(roomId, request.sid)}"
        emit("server_message", log, to=roomId)
    else:   # valid move
        log = f"valid action by player{get_player(roomId, request.sid)}: {list(move.values())}"
        emit("server_message", log, to=roomId)
        room.game = game_copy
        room.turn = not room.turn
        emit("game_turn", rooms[roomId].turn, to=roomId)
        emit("game_board", str(room.game).split('\n'), to=roomId)

# @socketio.on("game: start")
# def game_start(roomId):
#     print(f"game start on room {roomId}")


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
