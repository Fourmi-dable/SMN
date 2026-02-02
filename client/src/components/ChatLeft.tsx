import { useMemo, useState } from "react";
import type {
    ActiveChat, ConnectedUser, Message, PrivateConversation,
    PublicConversation, UserDatas
} from "../types/types";
import { formatMessage, getChatTitle, sendWizz } from "../utils";
import { socket } from "../socket/socket";

const ChatLeft = ({ activeChat, userData, chatWindowRef,
    conversations, messagesContentRef, connectedUsers }: {
        activeChat: ActiveChat,
        userData: UserDatas,
        chatWindowRef: React.RefObject<HTMLDivElement> | null,
        conversations: [PublicConversation[], PrivateConversation[]],
        messagesContentRef: React.RefObject<HTMLDivElement>,
        connectedUsers: ConnectedUser[] | null
    }) => {
    const [canSendWizz, setCanSendWizz] = useState(true);
    const [messageInput, setMessageInput] = useState<string>("");

    const currentMessages = useMemo(() => {
        if (activeChat.type === "public") {
            return conversations[0][0]?.chatHistory || [];
        }
        return conversations[1].find((conv: PrivateConversation) =>
            conv.userId === activeChat.user?.uuid)?.chatHistory || [];
    }, [activeChat, conversations]);

    const handleSendMessage = () => {
        if (messageInput.trim() === "") return;

        const message: Message = {
            from: userData.uuid,
            to: activeChat.type === "private" && activeChat.user
                ? activeChat.user.uuid
                : "public-room",
            content: messageInput,
        };

        socket.emit(
            activeChat.type === "public" ? 'message-public-room' : 'message-private',
            message
        );
        setMessageInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (<div className="conversation-left">
        <div className="messages-container">
            <div className="container-header">
                <div>
                    {getChatTitle(activeChat)}
                </div>
            </div>

            <div className="messages-content" ref={messagesContentRef}>
                {currentMessages.map((message: Message, id: number) => {
                    const { displayName, color, content } = formatMessage(message, connectedUsers);
                    const previousMessage = currentMessages[id - 1];
                    const showDisplayName = !previousMessage || previousMessage.from !== message.from;
                    return (
                        displayName === "Système"
                            ? (
                                <div key={id} className="message-content" style={{ color: "grey" }}>{content}</div>
                            ) :
                            <div key={id} style={{ color }}>
                                {showDisplayName && <span style={{ fontSize: "16px" }}> {displayName} <span style={{ color: "#787878" }}>dit :</span></span>}
                                <div className="message-content" style={{ color, fontWeight: "400", fontSize: "18px", marginLeft: "2px" }}><span style={{ color: "#787878" }}>.</span> {content}</div>
                            </div>
                    );
                })}
            </div>
        </div>

        <div className="chat-input-container">
            <div className="container-header">
                <button>A</button>
                <button>😃</button>
                <button>😉</button>
                <button onClick={() => sendWizz(canSendWizz, setCanSendWizz, chatWindowRef)}>
                    😖
                </button>
            </div>
            <div className="chat-input">
                <textarea
                    style={{ color: userData?.color }}
                    placeholder="Tape ton message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSendMessage}>Envoyer</button>
            </div>
        </div>
    </div>)
}

export default ChatLeft;