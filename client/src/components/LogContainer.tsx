import React, { useEffect, useRef } from "react";
import "./LogContainer.css";

interface Props {
  logs: string[];
}

export const LogContainer: React.FC<Props> = ({ logs }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logs.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  });
  return (
    <div className="log-box">
      {/* Server Logs */}
      <div className="log-container">
        {logs.map((log, index) => (
          <p key={index} className="log">
            server: {log}
          </p>
        ))}
        <div ref={ref}></div>
      </div>
    </div>
  );
};
