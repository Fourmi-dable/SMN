import './App.css'
import "7.css/dist/7.css";
import { Login } from "./views/Login";
import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import { Chat } from "./views/Chat";
import type { UserDatas } from "./types";
import { socket } from './socket.tsx'
import type { ConnectedUser } from './types/types.ts';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ username: string, status: string, onlineStatus: number, selectedAvatar: number, color: string } | null>();
  const [connectedUserList, setConnectedUserList] = useState<ConnectedUser[] | null>(null);

  console.log("connectedUserList:", connectedUserList);

  const isValidData = (data: any) => {
    if (!data.username || !data.username.trim() || data.username.trim().length > 30 || data.username.trim().length < 2) return false;
    if (data.onlineStatus < 0 || data.onlineStatus > 2) data.onlineStatus = 0;
    if (data.selectedAvatar < 0 || data.selectedAvatar >= 36) data.selectedAvatar = 0;
    if (!data.status) data.status = "";
    if (!data.color) data.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    return true;
  }

  const logUser = (userData: UserDatas) => {
    if (!isValidData(userData)) return;
    setUserData(userData);
    setIsLoggedIn(true);
    socket.emit("login", userData);
  }

  useEffect(() => {
    const savedData = localStorage.getItem("SMN-DATA");
    if (savedData) {
      logUser(JSON.parse(savedData))
    }
  }, []);

  useEffect(() => {
    function getConnectedUserList(userList: ConnectedUser[]) {
      setConnectedUserList(userList);
    }

    socket.on('connectedUsersList', getConnectedUserList);

    return () => {
      socket.off('connectedUsersList', getConnectedUserList);
    };
  }, []);


  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" />
        SMN Messenger
        <button>Options</button>
      </div>
      {isLoggedIn && userData ? <Chat userData={userData} connectedUserList={connectedUserList} /> :
        <Login logUser={logUser} />}
    </div >
  )
}

export default App
