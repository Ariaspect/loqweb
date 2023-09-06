import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { socket } from "./socket";

import MainPage from "./pages/MainPage";
import RoomPage from "./pages/RoomPage";

import "./App.css";
import { SocketTag } from "./components/SocketTag";

function App() {
  const [connection, setConnection] = useState<boolean>(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setConnection(true);
      console.log(`socket{${socket.id}} connected successfully`);
    });

    const cleanup = () => {
      socket.off("connect");
      socket.disconnect();
    };

    return () => {
      cleanup();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rooms/:roomId" element={<RoomPage />} />
      </Routes>
      <SocketTag sid={socket.id} connection={connection} />
    </BrowserRouter>
  );
}

export default App;
