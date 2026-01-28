import React, { useCallback, useEffect, useState } from "react";
import "./Chat.css";
import { socket } from '../socket/socket.tsx'
import type { ConversationsList } from "../types/types.ts";
import ContactsWindow from "../components/ContactsWindow.tsx";
import { privateMessageListener, publicMessageListener } from "../socket/messages.tsx";
import type { ActiveChat } from "../types/types.ts";
import { useUserData } from "../contexts/UserContext.tsx";
import { defaultPrivateConversation, defaultPublicConversation } from "../utils.tsx";
import ChatWindow from "../components/ChatWindow.tsx";

export const Chat: React.FC = () => {
    const { userData, setUserData } = useUserData();
    const [conversations, setConversations] = useState<ConversationsList>([
        [defaultPublicConversation], [defaultPrivateConversation]
    ]);

    const [activeChat, setActiveChat] = useState<ActiveChat>({
        type: "public", range: 0, user: null
    });

    const handlePublicMessage = useCallback(() => {
        publicMessageListener(socket, userData, activeChat, setConversations);
    }, [userData, activeChat]);

    const handlePrivateMessage = useCallback(() => {
        privateMessageListener(socket, userData, activeChat, setConversations);
    }, [userData, activeChat]);

    useEffect(() => {
        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            const { conversationList } = JSON.parse(savedData);
            if (conversationList) {
                setConversations(conversationList);
            }
        }

        socket.off('message-public-room');
        socket.off('message-private')

        handlePrivateMessage();
        handlePublicMessage();

        return () => {
            socket.off('message-public-room');
            socket.off('message-private')
        };
    }, [handlePublicMessage, handlePrivateMessage]);

    const updateStatus = (newStatus: number) => {
        setUserData((prev) => {
            if (!prev) return prev;
            return { ...prev, onlineStatus: newStatus };
        });

        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            const data = JSON.parse(savedData);
            data.onlineStatus = newStatus;
            localStorage.setItem("SMN-DATA", JSON.stringify(data));
        }
        socket.emit("update-status", newStatus);
    }

    return (
        <div className="chat-view" >
            <ContactsWindow
                userData={userData}
                conversations={conversations}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setConversations={setConversations}
                updateStatus={updateStatus}
            />
            <ChatWindow
                userData={userData}
                conversations={conversations}
                activeChat={activeChat}
            />
        </div >
    );
}