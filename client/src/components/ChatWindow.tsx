import { useRef, useEffect } from "react";
import { disconnect } from "../utils";
import { DraggableWindow } from "./DraggableWindow";
import type {
    ActiveChat, PrivateConversation,
    PublicConversation, UserDatas
} from "../types/types";
import logo from "../assets/logo.png";
import { useUserData } from "../contexts/UserContext";
import ChatRight from "./ChatRight";
import ChatLeft from "./ChatLeft";

const ChatWindow = ({ activeChat, conversations, userData }: {
    messagesContentRef: React.RefObject<HTMLDivElement>,
    activeChat: ActiveChat,
    conversations: [PublicConversation[], PrivateConversation[]],
    userData: UserDatas
}) => {
    const messagesContentRef = useRef<HTMLDivElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const { onlineStatus, selectedAvatar } = userData;
    const { connectedUsers } = useUserData();

    // Scroll en bas du chat à chaque nouveau message
    useEffect(() => {
        if (messagesContentRef.current) {
            messagesContentRef.current.scrollTop = messagesContentRef.current.scrollHeight;
        }
    }, [conversations]);

    const getChatTitle = (activeChat: ActiveChat): string => {
        if (activeChat.type === "public") {
            return "Salon public";
        }
        const username = activeChat.user?.username || "";
        return `Discussion avec ${username.length > 25 ? username.slice(0, 25) + "..." : username}`;
    };

    return (
        <DraggableWindow
            className="window glass active chat-window conversation"
            initialPosition={{ left: 500, top: 120 }}
            ref={chatWindowRef}
        >
            <div className="title-bar">
                <div>
                    <div className="title-bar-text">
                        <img src={logo} alt="logo" />
                        <span>SMN Messenger</span> <p className="title-bar-chat-label">- {getChatTitle(activeChat)}</p>
                    </div>
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={disconnect}></button>
                </div>
            </div>

            <div className="window-body has-space">
                <div className="conversation-container">
                    <ChatLeft
                        activeChat={activeChat}
                        userData={userData}
                        chatWindowRef={chatWindowRef}
                        conversations={conversations}
                        messagesContentRef={messagesContentRef}
                        connectedUsers={connectedUsers}
                    />
                    <ChatRight
                        activeChat={activeChat}
                        connectedUsers={connectedUsers}
                        onlineStatus={onlineStatus}
                        selectedAvatar={selectedAvatar}
                    />
                </div>
            </div>
        </DraggableWindow>
    );
};

export default ChatWindow;