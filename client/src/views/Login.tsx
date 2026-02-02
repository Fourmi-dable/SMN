import { useEffect, useState } from "react";
import { AvatarList } from "../components/AvatarList";
import { Avatar } from "../components/Avatar";
import type { UserDatas } from "../types/types";
import { v4 as uuidv4 } from 'uuid';
import StatusSelect from "../components/StatusSelect";
import LoginInput from "../components/LoginInput";
import { isValidStatus, isValidUsername } from "../utils";

type LoginProps = {
    logUser: (userData: UserDatas) => void;
};

export const Login: React.FC<LoginProps> = ({ logUser }) => {
    const [avatarListOpen, setAvatarListOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [onlineStatus, setOnlineStatus] = useState(0);

    useEffect(() => {
        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            const data = JSON.parse(savedData);
            setUsername(data.username);
            setStatus(data.status);
            setOnlineStatus(data.onlineStatus);
            setSelectedAvatar(data.selectedAvatar);
        }
    }, []);

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const onStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.value);
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Submitting with username:", username, "and status:", status);
        if (!isValidUsername(username)) {
            alert(`Le pseudo doit faire entre 3 et 100 caractères.`);
            return;
        }

        if (!isValidStatus(status)) {
            alert("Le statut ne doit pas dépasser 100 caractères.");
            return;
        }

        const userData = {
            uuid: uuidv4(),
            username: username.trim(),
            status: status.trim(),
            onlineStatus: onlineStatus || 0,
            selectedAvatar: selectedAvatar || 0,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        };

        localStorage.setItem("SMN-DATA", JSON.stringify(userData));
        logUser(userData);
    }

    return (
        <>
            <form className="main-container" onSubmit={onSubmit}>
                <Avatar
                    onlineStatus={onlineStatus}
                    selectedAvatar={selectedAvatar}
                    size="large"
                />
                <button
                    className="blue-bg btn-small"
                    type="button"
                    onClick={() => setAvatarListOpen(true)}
                >
                    Changer
                </button>
                <div className="group">
                    <LoginInput
                        type="text"
                        label="Pseudo"
                        id="username"
                        value={username}
                        onChange={onUsernameChange}
                    />
                    <LoginInput
                        type="text"
                        label="Statut"
                        id="status"
                        value={status}
                        onChange={onStatusChange}
                    />
                    <StatusSelect onlineStatus={onlineStatus} setOnlineStatus={setOnlineStatus} />
                    <button className="blue-bg" type="submit">
                        Se connecter
                    </button>
                </div>
            </form>
            {
                avatarListOpen &&
                <AvatarList
                    setAvatarListOpen={setAvatarListOpen}
                    setSelectedAvatar={setSelectedAvatar}
                />
            }
        </>
    )
}