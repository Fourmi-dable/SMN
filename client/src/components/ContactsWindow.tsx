import { useMemo } from "react";
import { DraggableWindow } from "./DraggableWindow";
import { Avatar } from "../components/Avatar";
import logo from "../assets/logo.png";
import groupChatLogo from "../assets/group-chat.png"
import "../views/Chat.css";
import type { ConnectedUser, PrivateConversation, PublicConversation, UserDatas } from "../types/types";
import StatusSelect from "./StatusSelect";
import { useUserData } from "../contexts/UserContext";

type ActiveChat = {
    type: "public" | "private";
    range: number;
    user: ConnectedUser | null;
}

const ContactsWindow = ({ userData, activeChat, conversations, setActiveChat, setConversations, updateStatus }: {
    userData: UserDatas | null,
    activeChat: ActiveChat,
    conversations: [PublicConversation[], PrivateConversation[]],
    setActiveChat: React.Dispatch<React.SetStateAction<ActiveChat>>,
    setConversations: React.Dispatch<React.SetStateAction<[PublicConversation[], PrivateConversation[]]>>,
    updateStatus: (newStatus: number) => void
}) => {
    const { username = "", status = "", onlineStatus = 0, selectedAvatar = 0 } = userData || {};
    const { connectedUsers } = useUserData();

    const connectedUsersCount = useMemo(() => {
        return connectedUsers?.length ? connectedUsers.length - 1 : 0;
    }, [connectedUsers]);

    const handlePublicChatClick = () => {
        setActiveChat({ type: "public", range: 0, user: null });
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

    const handlePrivateChatClick = (user: ConnectedUser, id: number) => {
        setActiveChat({ type: "private", range: id, user });
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
        >
            <div className="title-bar">
                <div className="title-bar-text">
                    <img src={logo} alt="logo" />
                    <span>SMN Messenger</span> - Contacts
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>

            <div className="window-body has-space">
                <div className="user-infos-container">
                    <Avatar onlineStatus={onlineStatus} selectedAvatar={selectedAvatar} />
                    <div className="user-infos">
                        <div className="info">{username}</div>
                        <div className="info small">{status || "<Pas de statut>"}</div>
                        <StatusSelect onlineStatus={onlineStatus} setOnlineStatus={updateStatus} />
                    </div>
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
                                            <p>{user.username} -</p>
                                            <p className="section-user-bio">{user.status}</p>
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