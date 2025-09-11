import { io } from "socket.io-client";
import './App.css'
import "7.css/dist/7.css";
import { useState } from "react";
import { avatars } from "./avatars";
import { AvatarList } from "./components/AvatarList";

function App() {
  const [avatarListOpen, setAvatarListOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const socket = io(import.meta.env.VITE_SERVER_URL);

  console.log("Socket depuis le client:", socket);

  return (
    <div className="container">
      <div className="main-container">
        <div className="avatar-container">
          <img src={selectedAvatar} alt="Logo" />
        </div>
        <button
          className="blue-bg btn-small"
          onClick={() => setAvatarListOpen(true)}
        >
          Changer
        </button>
        <div className="group">
          <div className="input-container">
            <label htmlFor="username">Pseudo:</label>
            <input type="text" id="username" placeholder="Pseudo" />
          </div>
          <div className="input-container">
            <label htmlFor="status">Statut:</label>
            <input type="text" id="status" placeholder="Statut" />
          </div>
          <div className="status-select">
            <label htmlFor="online">Etat:</label>
            <select id="online" defaultValue={"En ligne"}>
              <option>🟢 En ligne</option>
              <option>🔴 Occupé</option>
              <option>🟠 Ailleurs</option>
            </select>
          </div>
          <button className="blue-bg">Se connecter</button>
        </div>
      </div>
      {
        avatarListOpen &&
        <AvatarList
          setAvatarListOpen={setAvatarListOpen}
          setSelectedAvatar={setSelectedAvatar}
        />
      }
    </div >
  )
}

export default App
