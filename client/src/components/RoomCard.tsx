import React from "react";
import { Card } from "react-bootstrap/";

import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  roomId: number;
  onClickHandler: () => void;
}

export const RoomCard: React.FC<Props> = ({ roomId, onClickHandler }) => (
  <Card className="roomcard" border="primary" onClick={onClickHandler}>
    <Card.Header>Room {roomId}</Card.Header>
    <Card.Body>
      <Card.Title>Click to enter</Card.Title>
      <Card.Text></Card.Text>
    </Card.Body>
  </Card>
);
