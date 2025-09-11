import { io } from "socket.io-client";
import './App.css'
import "7.css/dist/7.css";
import avatar from "./assets/butterfly.jpg"
import { useState } from "react";

function App() {
  const [avatarListOpen, setAvatarListOpen] = useState(false);
  const socket = io(import.meta.env.VITE_SERVER_URL);

  console.log("Socket depuis le client:", socket);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "500px" }}>
        <div className="main-container">
          <div className="avatar-container">
            <img src={avatar} alt="Logo" />
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
      </div >
      {
        avatarListOpen &&
        <div className="window active" style={{ width: "500px", position: "absolute" }}>
          <div className="title-bar">
            <div className="title-bar-text">SMN Messenger - Choisis ton avatar</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close" onClick={() => setAvatarListOpen(false)}></button>
            </div>
          </div>
          <div className="window-body has-space" style={{ display: "flex", flexWrap: "wrap" }}>
            <div className="avatar-container">
              <img src={avatar} alt="Logo" />
            </div>
            <div className="avatar-container">
              <img src={avatar} alt="Logo" />
            </div>
            <div className="avatar-container">
              <img src={avatar} alt="Logo" />
            </div>
            <div className="avatar-container">
              <img src={avatar} alt="Logo" />
            </div>
          </div>
        </div >
      }
    </div >
  )
}

export default App
