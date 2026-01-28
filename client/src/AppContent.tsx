import './App.css';
import "7.css/dist/7.css";
import { Login } from "./views/Login";
import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import { Chat } from "./views/Chat";
import type { UserDatas } from "./types/types";
import { socket } from './socket/socket.tsx';
import { isValidData } from './utils.tsx';
import { useUserData } from './contexts/UserContext.tsx';

const AppContent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { userData, setUserData } = useUserData();

    const logUser = (userData: UserDatas) => {
        if (!isValidData(userData)) return;
        setUserData(userData);
        setIsLoggedIn(true);
        socket.emit("login", userData);
    };

    useEffect(() => {
        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            logUser(JSON.parse(savedData))
        }
    }, []);

    return (
        <div className="container">
            <div className="header">
                <img src={logo} alt="Logo" />
                SMN Messenger
                <button>Options</button>
            </div>
            {isLoggedIn && userData
                ? <Chat />
                : <Login logUser={logUser} />}
        </div>
    );
}

export default AppContent;
