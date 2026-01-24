import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { socket } from '../socket/socket.tsx'
import type { ChatProps, ConversationsList } from "../types/types.ts";
import ConversationWindow from "../components/ConversationWindow.tsx";
import ContactsWindow from "../components/ContactsWindow.tsx";
import { privateMessageListener, publicMessageListener } from "../socket/messages.tsx";
import type { ActiveChat } from "../types/types.ts";
import { useUserData } from "../contexts/UserContext.tsx";
import { defaultPrivateConversation, defaultPublicConversation } from "../utils.tsx";

export const Chat: React.FC<ChatProps> = () => {
    const { userData } = useUserData();
    const [conversations, setConversations] = useState<ConversationsList>([
        [defaultPublicConversation], [defaultPrivateConversation]
    ]);

    const [activeChat, setActiveChat] = useState<ActiveChat>({
        type: "public", range: 0, user: null
    });

    const messagesContentRef = useRef<HTMLDivElement>(null);

    // Scroll en bas du chat à chaque nouveau message
    useEffect(() => {
        if (messagesContentRef.current) {
            messagesContentRef.current.scrollTop = messagesContentRef.current.scrollHeight;
        }
    }, [conversations]);

    useEffect(() => {
        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            const { conversationList } = JSON.parse(savedData);
            if (conversationList) {
                setConversations(conversationList);
            }
        }

        publicMessageListener(socket, userData, activeChat, setConversations);
        privateMessageListener(socket, userData, activeChat, setConversations);

        return () => {
            socket.off('message-public-room');
            socket.off('message-private')
        };
    }, []);

    return (
        <div className="chat-view" >
            <ContactsWindow
                userData={userData}
                conversations={conversations}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
            />
            <ConversationWindow
                userData={userData}
                conversations={conversations}
                messagesContentRef={messagesContentRef}
                activeChat={activeChat}
            />
        </div >
    );
}