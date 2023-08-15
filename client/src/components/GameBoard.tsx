import React from "react";
import Ansi from "ansi-to-react";
import { Bush } from ".";
import "./GameBoard.css";

interface Props {
  board: string[];
}

export const GameBoard: React.FC<Props> = ({ board }) => (
  <div className="board-box">
    <Bush />
    {board.map((line) => (
      <div className="ansi-wrapper">
        <Ansi className="whitespace-preserving">{line}</Ansi>
      </div>
    ))}
  </div>
);
