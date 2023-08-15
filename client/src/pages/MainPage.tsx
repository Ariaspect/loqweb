import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import { RoomCard } from "../components/RoomCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
// import { socket } from "../socket";

function MainPage() {
  const navigate = useNavigate();
  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
    // socket.emit("room: join", roomId);
  };
  return (
    <>
      <section className="header">
        <h1>League of Quoridor</h1>
      </section>
      <div className="cardgroup">
        {[1, 2, 3, 4, 5].map((n) => (
          <RoomCard roomId={n} onClickHandler={() => handleRoomClick(n)} />
        ))}
      </div>
    </>
  );
}
export default MainPage;
