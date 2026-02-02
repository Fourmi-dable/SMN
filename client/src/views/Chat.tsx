import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.css";
import { socket } from '../socket/socket.tsx'
import type { ConversationsList } from "../types/types.ts";
import ContactsWindow from "../components/ContactsWindow.tsx";
import { privateMessageListener, publicMessageListener } from "../socket/messages.tsx";
import type { ActiveChat } from "../types/types.ts";
import { useUserData } from "../contexts/UserContext.tsx";
import { defaultPrivateConversation, defaultPublicConversation, disconnect } from "../utils.tsx";
import ChatWindow from "../components/ChatWindow.tsx";

export const Chat: React.FC = () => {
    const { userData, setUserData } = useUserData();
    const [conversations, setConversations] = useState<ConversationsList>([
        [defaultPublicConversation], [defaultPrivateConversation]
    ]);
    const [activeChat, setActiveChat] = useState<ActiveChat>({
        type: "public", range: 0, user: null
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('contacts');
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const contactsWindowRef = useRef<HTMLDivElement>(null);
    const [canSendWizz, setCanSendWizz] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 900;
            setIsMobile(mobile);
            if (!mobile) setMobileView('contacts'); // Reset en desktop
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    socket.on("connect_error", (err) => {
        if (err?.message === "server_full") {
            alert("Serveur plein (50). Réessaie plus tard.");
            disconnect();
        }
    });

    const handlePublicMessage = useCallback(() => {
        publicMessageListener(socket, userData, activeChat, setConversations, isMobile, canSendWizz, setCanSendWizz, chatWindowRef);
    }, [userData, activeChat]);

    const handlePrivateMessage = useCallback(() => {
        privateMessageListener(socket, userData, activeChat, setConversations, isMobile, canSendWizz, setCanSendWizz, chatWindowRef);
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
        socket.off('message-private');
        socket.off('receive-wizz');

        handlePrivateMessage();
        handlePublicMessage();

        return () => {
            socket.off('message-public-room');
            socket.off('message-private');
            socket.off('receive-wizz');
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
        <div className="chat-view">
            {isMobile ? (
                mobileView === 'contacts' ? (
                    <ContactsWindow
                        userData={userData}
                        conversations={conversations}
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        setConversations={setConversations}
                        updateStatus={updateStatus}
                        isMobile={isMobile}
                        setMobileView={setMobileView}
                        chatWindowRef={chatWindowRef}
                        contactsWindowRef={contactsWindowRef}
                    />
                ) : (
                    <ChatWindow
                        userData={userData}
                        conversations={conversations}
                        activeChat={activeChat}
                        isMobile={isMobile}
                        setMobileView={setMobileView}
                        chatWindowRef={chatWindowRef}
                        canSendWizz={canSendWizz}
                        setCanSendWizz={setCanSendWizz}
                    />
                )
            ) : (
                <>
                    <ContactsWindow
                        userData={userData}
                        conversations={conversations}
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        setConversations={setConversations}
                        updateStatus={updateStatus}
                        isMobile={isMobile}
                        setMobileView={setMobileView}
                        chatWindowRef={chatWindowRef}
                        contactsWindowRef={contactsWindowRef}
                    />
                    <ChatWindow
                        userData={userData}
                        conversations={conversations}
                        activeChat={activeChat}
                        isMobile={isMobile}
                        setMobileView={setMobileView}
                        chatWindowRef={chatWindowRef}
                        canSendWizz={canSendWizz}
                        setCanSendWizz={setCanSendWizz}
                    />
                </>
            )}
        </div>
    );
}