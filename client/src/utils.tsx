import type { ActiveChat, ConnectedUser, Message, PrivateConversation, PublicConversation } from "./types/types";
import { socket } from "./socket/socket";

const STATUS_LABELS = ["(En ligne)", "(Occupé)", "(Ailleurs)"];

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
    return (username.trim().length >= 2 && username.trim().length <= 100);
}

const isValidStatus = (status: string): boolean => {
    return status.length <= 100;
}

const isValidData = (data: any) => {
    if (!data.username || !data.username.trim() || data.username.trim().length > 100
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
    if (socket && socket.disconnect) socket.disconnect();
    window.location.reload();
}

const sendWizz = (canSendWizz: boolean,
    setCanSendWizz: React.Dispatch<React.SetStateAction<boolean>>,
    activeChat: ActiveChat) => {

    if (!canSendWizz) {
        alert("Veuillez attendre avant d'envoyer un autre Wizz.");
        return;
    }
    setCanSendWizz(false);
    console.log("activeChat dans sendWizz:", activeChat);
    socket.emit('send-wizz', activeChat.user
        ? activeChat.user.uuid
        : "public-room"
    );

    setTimeout(() => setCanSendWizz(true), 5000);
}

const truncateUsername = (username: string, maxLength: number = 25): string => {
    return username.length > maxLength ? username.slice(0, maxLength) + '...' : username;
};

const getChatTitle = (chat: ActiveChat) => {
    if (chat.type === "public") {
        return (
            <div className="chat-title">
                <span className="chat-title-main">💬 Discussion publique</span>
                <span className="chat-title-sub">- Salon principal</span>
            </div>
        );
    }

    const user = chat.user;
    if (!user) return null;

    const truncatedUsername = truncateUsername(user.username);
    const statusLabel = STATUS_LABELS[user.onlineStatus || 0];
    const title = `💬 ${truncatedUsername} ${statusLabel}`;

    return (
        <div className="chat-title">
            <span className="chat-title-main">{title}</span>
            <span className="chat-title-sub"> - {user.status}</span>
        </div>
    );
};

const getUserColor = (uuid: string, connectedUsers: ConnectedUser[] | null): string => {
    return findUserByUuid(uuid, connectedUsers)?.color || "inherit";
};

const formatMessage = (message: Message, connectedUsers: ConnectedUser[] | null) => {
    const user = findUserByUuid(message.from, connectedUsers);
    const displayName = user?.username || "Système";
    const color = getUserColor(message.from, connectedUsers);

    return { displayName, color, content: message.content };
};

export {
    findUserByUuid,
    sendWizz,
    disconnect,
    defaultPublicConversation,
    defaultPrivateConversation,
    isValidUsername,
    isValidStatus,
    isValidData,
    getChatTitle,
    getUserColor,
    formatMessage
};