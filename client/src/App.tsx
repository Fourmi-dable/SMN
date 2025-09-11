import { io } from "socket.io-client";
import './App.css'
import "7.css/dist/7.css";
import avatar from "./assets/butterfly.jpg"

function App() {
  const socket = io(import.meta.env.VITE_SERVER_URL);

  console.log("Socket depuis le client:", socket);

  return (
    <>
      <div className="window active" style={{ width: "500px" }}>
        <div className="title-bar">
          <div className="title-bar-text">SMN Messenger - Se connecter</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body has-space main-container">
          <div className="avatar-container">
            <img src={avatar} alt="Logo" />
          </div>
          <button className="blue-bg btn-small">Changer</button>
          <div className="group">
            <label htmlFor="username">Pseudo:</label>
            <input type="text" id="username" placeholder="Pseudo" />
            <label htmlFor="status">Statut:</label>
            <input type="text" id="status" placeholder="Statut" />
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
    </>
  )
}

export default App
