import type { ConnectedUser, PrivateConversation, PublicConversation } from "./types/types";
import wizzSound from "./assets/sounds/wizz.mp3";
import { socket } from "./socket/socket";

const defaultPublicConversation: PublicConversation = {
    room: "public-room",
    unread: 0,
    chatHistory: []
};

const defaultPrivateConversation: PrivateConversation = {
    userId: "",
    unread: 0,
    chatHistory: []
};

const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username.trim());
}

const isValidData = (data: any) => {
    if (!data.username || !data.username.trim() || data.username.trim().length > 30
        || data.username.trim().length < 2) return false;
    if (data.onlineStatus < 0 || data.onlineStatus > 2) data.onlineStatus = 0;
    if (data.selectedAvatar < 0 || data.selectedAvatar >= 36) data.selectedAvatar = 0;
    if (!data.status) data.status = "";
    if (!data.color) data.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    return true;
};

const findUserByUuid = (uuid: string, connectedUserList: ConnectedUser[] | null):
    ConnectedUser | null => {
    if (!connectedUserList) return null;
    const user = connectedUserList.find(user => user.uuid === uuid);
    return user || null;
}

const disconnect = () => {
    localStorage.removeItem("SMN-DATA");
    socket.disconnect();
    window.location.reload();
}

const sendWizz = (canSendWizz: boolean,
    setCanSendWizz: React.Dispatch<React.SetStateAction<boolean>>,
    chatWindowRef: React.RefObject<HTMLDivElement>) => {
    const wizz = new Audio(wizzSound);

    if (!canSendWizz) {
        alert("Veuillez attendre avant d'envoyer un autre Wizz.");
        return;
    }
    setCanSendWizz(false);
    setTimeout(() => setCanSendWizz(true), 5000);

    wizz.play();
    chatWindowRef.current?.classList.add("wizz-animation");

    setTimeout(() => {
        chatWindowRef.current?.classList.remove("wizz-animation");
    }, 1000);
}

export {
    findUserByUuid,
    sendWizz,
    disconnect,
    defaultPublicConversation,
    defaultPrivateConversation,
    isValidUsername,
    isValidData
};