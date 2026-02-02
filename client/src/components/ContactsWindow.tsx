import { useMemo } from "react";
import { DraggableWindow } from "./DraggableWindow";
import { Avatar } from "../components/Avatar";
import logo from "../assets/logo.png";
import groupChatLogo from "../assets/group-chat.png"
import "../views/Chat.css";
import type { ConnectedUser, PrivateConversation, PublicConversation, UserDatas } from "../types/types";
import StatusSelect from "./StatusSelect";
import { useUserData } from "../contexts/UserContext";
import { disconnect } from "../utils";

type ActiveChat = {
    type: "public" | "private";
    range: number;
    user: ConnectedUser | null;
}

const ContactsWindow = ({ userData, activeChat, conversations, setActiveChat, setConversations, updateStatus, isMobile, setMobileView, chatWindowRef, contactsWindowRef }: {
    userData: UserDatas | null,
    activeChat: ActiveChat,
    conversations: [PublicConversation[], PrivateConversation[]],
    setActiveChat: React.Dispatch<React.SetStateAction<ActiveChat>>,
    setConversations: React.Dispatch<React.SetStateAction<[PublicConversation[], PrivateConversation[]]>>,
    updateStatus: (newStatus: number) => void,
    chatWindowRef: React.RefObject<HTMLDivElement>,
    contactsWindowRef: React.RefObject<HTMLDivElement>,
    isMobile: boolean,
    setMobileView: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { username = "", status = "", onlineStatus = 0, selectedAvatar = 0 } = userData || {};
    const { connectedUsers } = useUserData();

    const connectedUsersCount = useMemo(() => {
        return connectedUsers?.length ? connectedUsers.length - 1 : 0;
    }, [connectedUsers]);

    const displayChatWindow = () => {
        if (isMobile) { setMobileView('chat') } else {
            if (chatWindowRef.current) {
                chatWindowRef.current.style.display = 'block';
            }
        }
    }

    const handlePublicChatClick = () => {
        setActiveChat({ type: "public", range: 0, user: null });
        displayChatWindow();
        const newConvs: [PublicConversation[], PrivateConversation[]] = [
            conversations[0].map(conv => "room" in conv ? { ...conv, unread: 0 } : conv),
            conversations[1]
        ];

        const updatedData = {
            ...JSON.parse(localStorage.getItem('SMN-DATA') || '{}'),
            conversationList: newConvs
        };
        localStorage.setItem('SMN-DATA', JSON.stringify(updatedData));
        setConversations(newConvs);
    };

    const handleDisconnect = () => {
        //message de conformation avant de se déconnecter
        const confirmDisconnect = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
        if (confirmDisconnect)
            disconnect();
    }

    const handlePrivateChatClick = (user: ConnectedUser, id: number) => {
        setActiveChat({ type: "private", range: id, user });
        displayChatWindow();
        const userConv = conversations[1].find(conv => conv.userId === user.uuid);
        if (userConv) {
            setConversations(prev => {
                const newConvs: [PublicConversation[], PrivateConversation[]] = [prev[0], prev[1]];
                newConvs[1] = newConvs[1].map(conv =>
                    conv.userId === user.uuid ? { ...conv, unread: 0 } : conv
                );

                const updatedData = {
                    ...JSON.parse(localStorage.getItem('SMN-DATA') || '{}'),
                    conversationList: newConvs
                };
                localStorage.setItem('SMN-DATA', JSON.stringify(updatedData));

                return newConvs;
            });
        }
    };

    return (
        <DraggableWindow
            className="window glass active chat-window"
            initialPosition={{ left: 10, top: 60 }}
            isMobile={isMobile}
            ref={contactsWindowRef}
        >
            <div className="title-bar">
                <div className="title-bar-text">
                    <img src={logo} alt="logo" />
                    <span>SMN Messenger</span> - Contacts
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={handleDisconnect}></button>
                </div>
            </div>

            <div className="window-body has-space">
                <div className="user-infos-container">
                    <div style={{ display: "flex" }}>
                        <Avatar onlineStatus={onlineStatus} selectedAvatar={selectedAvatar} />
                        <div className="user-infos">
                            <div className="info user-info-username">{username}</div>

                        </div>
                    </div>
                    <div className="info user-info-status">{status || "<Pas de statut>"}</div>
                    <StatusSelect onlineStatus={onlineStatus} setOnlineStatus={updateStatus} />
                </div>

                <div className="separation-line" />

                <div className="chat-sections-container">
                    <section>
                        <div className="section-title">Salons Publics (1)</div>
                        <div
                            className={`section-content group-chat-container 
                                ${activeChat.type === "public" && activeChat.range === 0 ? "selected" : ""} 
                                ${conversations[0][0].unread > 0 ? "unread" : ""}`}
                            onClick={handlePublicChatClick}
                        >
                            <img src={groupChatLogo} />
                            <p>Salon Principal <span>({connectedUsersCount} connectés)</span></p>
                            {conversations[0][0]?.unread && conversations[0][0].unread > 0
                                ? <div className="unread-badge">{conversations[0][0].unread}</div>
                                : null
                            }
                        </div>
                    </section>

                    <section>
                        <div className="section-title">Utilisateurs connectés ({connectedUsersCount})</div>
                        <div className="section-content user-list-container">
                            {connectedUsers
                                ?.filter(user => user.uuid !== userData?.uuid)
                                .map((user, id) => {
                                    const userConv = conversations[1].find(conv => conv.userId === user.uuid);
                                    return (
                                        <div
                                            key={user.uuid}
                                            className={`section-user-connected 
                                                ${activeChat.type === "private" && activeChat.range === id ? "selected" : ""} 
                                                ${userConv?.unread && userData?.uuid !== userConv.userId ? "unread" : ""}`}
                                            onClick={() => handlePrivateChatClick(user, id)}
                                        >
                                            <div className="section-user-status">
                                                {["🟢", "🔴", "🟠"][user.onlineStatus] || "🟢"}
                                            </div>
                                            <p>{user.username.length > 15 ? user.username.substring(0, 15) + "..." : user.username}</p>
                                            {user.status && <p className="section-user-bio">- {user.status}</p>}
                                            {userConv?.unread && userConv.unread > 0
                                                ? <div className="unread-badge">{userConv.unread}</div>
                                                : null
                                            }
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </div>

                <div className="separation-line" />
            </div>
        </DraggableWindow>
    );
};

export default ContactsWindow;