import React from "react";

interface Props {
  sid: string;
  connection: boolean;
}

export const SocketTag: React.FC<Props> = ({ sid, connection }) => (
  <div
    style={{
      display: "flex",
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "lightgray",
      padding: "10px",
    }}
  >
    {connection ? "🟢" + sid : "🔴 Not connected"}
  </div>
);
