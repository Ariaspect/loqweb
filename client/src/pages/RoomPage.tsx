// RoomPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

import { socket } from "../socket";
import { LogContainer, GameBoard, ActInput } from "../components";

import "bootstrap/dist/css/bootstrap.min.css";

function RoomPage() {
  const { roomId } = useParams();

  const [p0, setP0] = useState<string>("");
  const [p1, setP1] = useState<string>("");
  const [board, setBoard] = useState<string[]>([]);
  // const [turn, setTurn] = useState<boolean>(false);

  const [log, setLog] = useState<string[]>([]);

  const handlePlayer0 = () => {
    socket.emit("room: player", {
      roomId: roomId,
      player: 0,
      user: !p0 ? socket.id : "",
    });
    //* !p0 ? setP0(socket.id) : setP0("");
  };
  const handlePlayer1 = () => {
    socket.emit("room: player", {
      roomId: roomId,
      player: 1,
      user: !p1 ? socket.id : "",
    });
    //* !p1 ? setP1(socket.id) : setP1("");
  };

  useEffect(() => {
    // Listen for 'log_message' event from the server
    socket.emit("room: join", roomId);

    socket.on("server_message", (message: string) => {
      addLog(message);
    });

    socket.on("room_info", (data) => {
      setP0(data.player0);
      setP1(data.player1);
      data.player0 && data.player1 && socket.emit("game: ready", roomId);
    });

    socket.on("game_board", (data) => {
      setBoard(data);
    });
    socket.on("game_turn", (turn) => {
      // setTurn(turn);
      addLog(`player${turn ? 1 : 0}'s turn`);
    });

    const cleanup = () => {
      socket.off("log_message");
      socket.emit("room: leave", roomId);
    };

    // Clean up when closed
    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      // Clean up when component unmounts
      cleanup();
    };
  }, []);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  return (
    <>
      <section className="header">
        <h1>Room {roomId}</h1>
      </section>
      {!!board.length && <GameBoard board={board} />}
      <ActInput roomId={roomId} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button
          style={{
            margin: "0px 10px",
          }}
          variant={!p0 ? "dark" : "primary"}
          onClick={handlePlayer0}
          disabled={(!!p0 && p0 !== socket.id) || p1 === socket.id}
        >
          Player0 {p0}
        </Button>
        <Button
          style={{
            margin: "0px 10px",
          }}
          variant={!p1 ? "dark" : "danger"}
          onClick={handlePlayer1}
          disabled={(!!p1 && p1 !== socket.id) || p0 === socket.id}
        >
          Player1 {p1}
        </Button>
      </div>
      <LogContainer logs={log}></LogContainer>
    </>
  );
}

export default RoomPage;
