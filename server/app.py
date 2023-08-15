from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

from loq0 import Game, ACTION

# import json
from typing import List

app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysafepassword'
CORS(app, resources={r'*': {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def index():
    return "Test index"


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(f"client{{{ request.sid }}} has connected")
    emit("connected", {"id": request.sid})


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print(f"client{{{ request.sid }}} has disconnected")
    emit("disconnected", {"id": request.sid}, broadcast=True)


"""room events"""


class Room:
    player0: str
    player1: str
    ready: int
    # spectators: List[str]
    game: Game

    def __init__(self):
        self.player0 = ""
        self.player1 = ""
        self.ready = 0
        # self.spectators = []
        self.game = Game()

    def __json__(self):
        return {
            "player0": self.player0,
            "player1": self.player1
        }
    # def __str__(self):
    #     return f"{self.player0} vs {self.player1}\n{self.game}"


@socketio.on("room: join")
def join(roomId):
    """event listener when client joins room"""
    join_room(roomId)
    log = f"client{{{ request.sid }}} has joined room {roomId}"
    print(log)
    emit("server_message", log, to=roomId)
    emit("room_info", rooms[roomId].__json__(), to=roomId)


@socketio.on("room: leave")
def leave(roomId):
    """event listener when client leaves room"""
    leave_room(roomId)
    log = f"client{{{ request.sid }}} has left room {roomId}"
    print(log)
    emit("server_message", log, to=roomId)
    if request.sid == rooms[roomId].player0:
        rooms[roomId].player0 = ""
    elif request.sid == rooms[roomId].player1:
        rooms[roomId].player1 = ""
    emit("room_info", rooms[roomId].__json__(), to=roomId)


@socketio.on("room: player")
def room_player(data):
    roomId = data['roomId']
    player = data['player']
    user = data['user']
    log = f"room{roomId}.player{player} is {f'client{{{ user }}}' if user else 'empty'}"
    if player == 0:
        rooms[roomId].player0 = data['user']
        emit("room_info", rooms[roomId].__json__(), to=roomId)
        emit("server_message", log, to=roomId)
        # emit("game_board", str(rooms[roomId].game).split('\n'), to=roomId)
    else:
        rooms[roomId].player1 = data['user']
        emit("room_info", rooms[roomId].__json__(), to=roomId)
        emit("server_message", log, to=roomId)


@socketio.on("game: ready")
def game_ready(roomId):
    rooms[roomId].ready += 1
    print(f"game ready[{rooms[roomId].ready}] on room {roomId}")
    if rooms[roomId].ready >= 2:
        rooms[roomId].ready = 0
        log = f"game start: {{{rooms[roomId].player0}}} vs {{{rooms[roomId].player1}}}"
        emit("game_start", to=roomId)
        emit("server_message", log, to=roomId)
        emit("game_board", str(rooms[roomId].game).split('\n'), to=roomId)


@socketio.on("game: act")
def game_act():
    rooms[roomId].game.act(0, 1, 1)

# @socketio.on("game: start")
# def game_start(roomId):
#     print(f"game start on room {roomId}")


if __name__ == "__main__":
    rooms = {str(_+1): Room() for _ in range(5)}
    socketio.run(app, debug=True)
