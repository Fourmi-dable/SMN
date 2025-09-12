import { io } from "socket.io-client";
import './App.css'
import "7.css/dist/7.css";
import { Login } from "./views/Login";
import { useEffect, useState } from "react";
import logo from "./assets/logo.png";

function App() {
  const socket = io(import.meta.env.VITE_SERVER_URL);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isValidData = (data: any) => {
    if (!data.username || !data.username.trim() || data.username.trim().length > 30 || data.username.trim().length < 2) return false;
    if (data.onlineStatus < 0 || data.onlineStatus > 2) data.onlineStatus = 0;
    if (data.selectedAvatar < 0 || data.selectedAvatar >= 36) data.selectedAvatar = 0;
    if (!data.status) data.status = "";
    return true;
  }

  useEffect(() => {
    const savedData = localStorage.getItem("SMN-DATA");
    if (savedData) {
      if (isValidData(JSON.parse(savedData))) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" />
        SMN Messenger
      </div>
      {isLoggedIn ? <div>Logged In</div> :
        <Login logUser={setIsLoggedIn} />}
    </div >
  )
}

export default App
