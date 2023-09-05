import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./ActInput.css";
import { socket } from "../socket";

interface Props {
  roomId?: string;
  p0: string;
  p1: string;
}

enum MoveType {
  Move = 0,
  Place_I = 1,
  Place_L = 2,
}

export const ActInput: React.FC<Props> = ({ roomId, p0, p1 }) => {
  const [moveType, setMoveType] = useState<MoveType>(MoveType.Move);
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();
  const [w, setW] = useState<number>();

  const [k, setK] = useState<number>(3);
  const [kickDis, setKickDis] = useState<boolean>(false);

  const sid = socket.id;
  const isPlayer = sid === p0 || sid === p1;

  const moves = [
    { name: "Move", value: MoveType.Move },
    { name: "Place_I", value: MoveType.Place_I },
    { name: "Place_L", value: MoveType.Place_L },
  ];

  const handlePlay = () => {
    socket.emit("game: act", { roomId: roomId, act: { moveType, x, y, w } });
  };
  const kickPlayer: React.MouseEventHandler = (event) => {
    setK(3 - event.detail);
  };

  useEffect(() => {
    if (k <= 0) {
      setKickDis(true);

      socket.emit("room: player", {
        roomId: roomId,
        player: 0,
        user: "",
      });
      socket.emit("room: player", {
        roomId: roomId,
        player: 1,
        user: "",
      });

      setTimeout(() => {
        setK(3);
        setKickDis(false);
      }, 2000);
    }
  }, [k]);

  return (
    <div className="input-box">
      <ButtonGroup className="mb-2">
        {moves.map((move, idx) => (
          <ToggleButton
            key={idx}
            id={`move-${idx}`}
            type="radio"
            variant={moveType === move.value ? "success" : "outline-dark"}
            name="radio"
            value={move.value}
            onChange={(e) =>
              setMoveType(parseInt(e.currentTarget.value) as MoveType)
            }
          >
            {move.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <InputGroup className="coord-input" hasValidation>
        <Form.Control
          required
          type="number"
          placeholder="x"
          onChange={(e) => setX(parseInt(e.target.value))}
          disabled={!isPlayer}
        />
        <Form.Control
          required
          type="number"
          placeholder="y"
          onChange={(e) => setY(parseInt(e.target.value))}
          disabled={!isPlayer}
        />
        <Form.Control
          required
          type="number"
          placeholder="w"
          onChange={(e) => setW(parseInt(e.target.value))}
          disabled={!isPlayer}
        />
        <Button
          className="play-btn"
          variant={isPlayer ? "primary" : "danger"}
          onClick={isPlayer ? handlePlay : kickPlayer}
          disabled={!isPlayer && kickDis}
        >
          {isPlayer ? "Play" : kickDis ? "Kicking..." : "Kick"}
        </Button>
      </InputGroup>
    </div>
  );
};
