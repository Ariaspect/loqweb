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
    socket.on("connected", ({ id }) => {
      setConnection(true);
      console.log(`socket{${id}} connected successfully`);
    });

    const cleanup = () => {
      socket.off("connect");
      socket.disconnect();
    };

    return () => {
      cleanup();
    };
  }, []);

  // const connect = () => socket.connect();
  // const disconnect = () => {
  //   socket.disconnect();
  //   setConnection(false);
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rooms/:roomId" element={<RoomPage />} />
      </Routes>
      <SocketTag sid={socket.id} connection={connection} />
    </BrowserRouter>
    // <>
    //   <h1>{connection ? "connected" : "disconnected"}</h1>
    //   <div>
    //     <button onClick={connect}>connect</button>
    //     <button onClick={disconnect}>disconnect</button>
    //   </div>
    //   <div>
    //     <input onChange={(e) => setMove(e.target.value)} />
    //     <button onClick={() => console.log(move)}>submit</button>
    //   </div>
    // </>
  );
}

export default App;
