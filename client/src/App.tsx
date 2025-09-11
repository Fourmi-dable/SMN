import { io } from "socket.io-client";
import './App.css'
import "7.css/dist/7.css";
import { useEffect, useState } from "react";
import { avatars } from "./avatars";
import { AvatarList } from "./components/AvatarList";

function App() {
  const [avatarListOpen, setAvatarListOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(0);

  const socket = io(import.meta.env.VITE_SERVER_URL);

  useEffect(() => {
    const savedData = localStorage.getItem("SMN-DATA");
    if (savedData) {
      const { username, status, onlineStatus, selectedAvatar } = JSON.parse(savedData);
      setUsername(username);
      setStatus(status);
      setOnlineStatus(onlineStatus);
      setSelectedAvatar(selectedAvatar);
    }
  }, []);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const onStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  }

  const onOnlineStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOnlineStatus(Number(e.target.value));
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Veuillez entrer un pseudo.");
      return;
    }

    const userData = {
      username,
      status,
      onlineStatus,
      selectedAvatar
    };

    localStorage.setItem("SMN-DATA", JSON.stringify(userData));
  }

  console.log("Socket depuis le client:", socket);

  return (
    <div className="container">
      <form className="main-container" onSubmit={onSubmit}>
        <div className="avatar-container">
          <img src={avatars[selectedAvatar]} alt="Logo" />
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
            <input type="text" id="username" placeholder="Pseudo" value={username} onChange={onUsernameChange} />
          </div>
          <div className="input-container">
            <label htmlFor="status">Statut:</label>
            <input type="text" id="status" placeholder="Statut" value={status} onChange={onStatusChange} />
          </div>
          <div className="status-select">
            <label htmlFor="online">Etat:</label>
            <select id="online" value={onlineStatus} onChange={onOnlineStatusChange}>
              <option value={0}>🟢 En ligne</option>
              <option value={1}>🔴 Occupé</option>
              <option value={2}>🟠 Ailleurs</option>
            </select>
          </div>
          <button className="blue-bg" type="submit">Se connecter</button>
        </div>
      </form>
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
