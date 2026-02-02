import { useRef, useEffect } from "react";
import { DraggableWindow } from "./DraggableWindow";
import type {
    ActiveChat, PrivateConversation,
    PublicConversation, UserDatas
} from "../types/types";
import logo from "../assets/logo.png";
import { useUserData } from "../contexts/UserContext";
import ChatRight from "./ChatRight";
import ChatLeft from "./ChatLeft";

const ChatWindow = ({ activeChat, conversations, userData, isMobile, setMobileView, chatWindowRef, canSendWizz, setCanSendWizz }: {
    messagesContentRef: React.RefObject<HTMLDivElement>,
    activeChat: ActiveChat,
    conversations: [PublicConversation[], PrivateConversation[]],
    userData: UserDatas,
    isMobile: boolean,
    setMobileView: React.Dispatch<React.SetStateAction<string>>,
    chatWindowRef: React.RefObject<HTMLDivElement>
}) => {
    const messagesContentRef = useRef<HTMLDivElement>(null);

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

    const minimiseChatWindow = () => {
        if (isMobile) {
            setMobileView('contacts');
        }
        else {
            if (chatWindowRef.current) {
                chatWindowRef.current.style.display = 'none';
            }
        }
    }

    return (
        <DraggableWindow
            className="window glass active chat-window conversation"
            initialPosition={{ left: isMobile ? 10 : 500, top: isMobile ? 60 : 120 }}
            ref={chatWindowRef}
            isMobile={isMobile}
        >
            <div className="title-bar">
                <div>
                    <div className="title-bar-text">
                        <img src={logo} alt="logo" />
                        <span>SMN Messenger</span> <p className="title-bar-chat-label">- {getChatTitle(activeChat)}</p>
                    </div>
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" onClick={minimiseChatWindow}></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={minimiseChatWindow}></button>
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
                        canSendWizz={canSendWizz}
                        setCanSendWizz={setCanSendWizz}
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