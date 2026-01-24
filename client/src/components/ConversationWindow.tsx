import { useRef, useState } from "react";
import { socket } from "../socket/socket";
import { disconnect, findUserByUuid, sendWizz } from "../utils";
import { Avatar } from "./Avatar";
import { DraggableWindow } from "./DraggableWindow";
import type { Message } from "../types/types";
import logo from "../assets/logo.png";
import { useUserData } from "../contexts/UserContext";

const ConversationWindow = ({ messagesContentRef, activeChat, conversations, userData }) => {
    const [canSendWizz, setCanSendWizz] = useState(true);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const { onlineStatus, selectedAvatar } = userData;
    const [messageInput, setMessageInput] = useState<string>("");
    const { connectedUsers } = useUserData();

    console.log("Connected users in ConversationWindow:", connectedUsers, conversations);

    const handleSendMessage = () => {
        if (messageInput.trim() === "") return;

        const message: Message = {
            from: userData.uuid,
            to: activeChat.type === "private" && activeChat.user ? activeChat.user.uuid : "public-room",
            content: messageInput.trim(),
        };

        if (activeChat.type === "public") {
            socket.emit('message-public-room', message);
        } else {
            socket.emit('message-private', message);
        }

        setMessageInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (<DraggableWindow
        className="window glass active chat-window conversation"
        initialPosition={{ left: 500, top: 120 }}
        ref={chatWindowRef}
    >
        <div className="title-bar" >
            <div className="title-bar-text">
                <img src={logo} alt="logo" />
                <span>SMN Messenger</span> - Chat
            </div>
            <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onClick={disconnect}></button>
            </div>
        </div>
        <div className="window-body has-space" >
            <div className="conversation-container">
                <div className="conversation-left">
                    <div className="messages-container">
                        <div className="container-header">
                            💬 {`Discussion ${activeChat.type === "public" ? 'publique' : 'avec'}`} - <span>{activeChat.user ? activeChat.user.username + ' - ' + activeChat.user.status : "Salon principal"}</span>
                        </div>
                        <div className="messages-content" ref={messagesContentRef}>
                            {activeChat.type === "public" ?
                                conversations[0][0].chatHistory.map((message) =>
                                    <div style={{ color: findUserByUuid(message.from, connectedUsers)?.color, fontSize: "16px" }}>{findUserByUuid(message.from, connectedUsers) ? findUserByUuid(message.from, connectedUsers)?.username + ` : ${message.content}` : <span style={{ color: "gray" }}>{message.content}</span>}</div>
                                )
                                :
                                conversations[1].find(conv => conv.userId === (activeChat.user ? activeChat.user.uuid : ""))?.chatHistory.map((message) =>
                                    <div style={{ color: findUserByUuid(message.from, connectedUsers)?.color, fontSize: "16px" }}>{findUserByUuid(message.from, connectedUsers) ? findUserByUuid(message.from, connectedUsers)?.username + ` : ${message.content}` : message.content}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="chat-input-container">
                        <div className="container-header">
                            <button>A</button>
                            <button>😃</button>
                            <button>😉</button>
                            <button onClick={() => sendWizz(canSendWizz, setCanSendWizz, chatWindowRef)}>😖</button>
                        </div>
                        <div className="chat-input">
                            <textarea style={{ color: userData?.color }} placeholder="Tape ton message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyDown} />
                            <button onClick={handleSendMessage}>Envoyer</button>
                        </div>
                    </div>
                </div>
                <div className="conversation-right">
                    {activeChat.type === "private" ? <Avatar onlineStatus={activeChat.user?.onlineStatus} selectedAvatar={activeChat.user?.avatar} size="xlarge" />
                        : <div style={{ width: "85%", padding: "8px 0", gap: "8px", display: "flex", flexDirection: "column" }}>
                            <p style={{ fontWeight: "bold", textAlign: "left" }}>Utilisateurs connectés: </p>
                            <div className="section-content" style={{ padding: 0 }}>
                                {connectedUsers && connectedUsers.map((user, id) =>
                                    <div className="section-user-connected" key={id}>
                                        <div className="section-user-status">
                                            {user.onlineStatus === 0
                                                ? "🟢"
                                                : user.onlineStatus === 1
                                                    ? "🔴"
                                                    : "🟠"
                                            }
                                        </div>
                                        <p>{user.username}</p>
                                    </div>
                                )}
                            </div>
                        </div>}
                    <Avatar
                        onlineStatus={onlineStatus}
                        selectedAvatar={selectedAvatar}
                        size="xlarge"
                    />
                </div>
            </div>
        </div>
    </DraggableWindow >)
}

export default ConversationWindow;