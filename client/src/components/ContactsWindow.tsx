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
const ContactsWindow = ({ userData, activeChat, conversations, setActiveChat, setConversations, setStatus }: {
    userData: UserDatas,
    activeChat: ActiveChat,
    conversations: [PublicConversation[], PrivateConversation[]],
    setActiveChat: React.Dispatch<React.SetStateAction<ActiveChat>>,
    setConversations: React.Dispatch<React.SetStateAction<[PublicConversation[], PrivateConversation[]]>>
}) => {
    console.log("userData in ContactsWindow:", userData);
    const { username, status, onlineStatus, selectedAvatar } = userData;

    const { connectedUsers } = useUserData();
    const onStatusChange = (status: number) => {
        setStatus(status);
    }

    console.log("Connected users in ContactsWindow:", connectedUsers, conversations);
    return (
        <DraggableWindow
            className="window glass active chat-window"
            initialPosition={{ left: 10, top: 60 }}
        >
            <div className="title-bar" >
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
                        <div className="info small">{status ? status : "<Pas de statut>"}</div>
                        <div className="info small" >
                            <StatusSelect onlineStatus={onlineStatus} setOnlineStatus={onStatusChange} />
                        </div>
                    </div>
                </div>
                <div className="separation-line" />
                <div className="chat-sections-container" >
                    <div className="section-title">Discussions en cours (0)</div>
                    <section>
                        <div className="section-title">Salons Publics (1)</div>
                        <div
                            className={`section-content group-chat-container ${activeChat.type === "public" && activeChat.range === 0 && "selected"} ${conversations[0][0].unread ? "unread" : ""}`}
                            onClick={() => {
                                setActiveChat({ type: "public", range: 0, user: null })
                                setConversations(prev => {
                                    const newConvs = [...prev];
                                    newConvs[0] = newConvs[0].map(conv => conv.room === "public-room" ? { ...conv, unread: 0 } : conv);
                                    return newConvs;
                                })
                            }
                            }
                        >
                            <img src={groupChatLogo} />
                            <p>Salon Principal <span>({connectedUsers ? (connectedUsers.length - 1) : 0} connectés)</span></p>
                        </div>
                    </section>
                    <section>
                        <div className="section-title">Utilisateurs connectés ({connectedUsers ? (connectedUsers.length - 1) : 0})</div>
                        <div className="section-content user-list-container">
                            {connectedUsers && Array.isArray(connectedUsers) && connectedUsers.filter(user => user.uuid !== userData.uuid).map((user, id) => {
                                const userConv = conversations[1].find(conv => conv.userId === user.uuid);
                                return (
                                    <div
                                        className={`section-user-connected ${activeChat.type === "private" && activeChat.range === id ? "selected" : ""} ${userConv?.unread && userData.uuid !== userConv.userId ? "unread" : ""}`}
                                        key={id}
                                        onClick={() => {
                                            setActiveChat({ type: "private", range: id, user: user });
                                            if (userConv) {
                                                setConversations(prev => {
                                                    const newConvs = [...prev];
                                                    newConvs[1] = newConvs[1].map(conv => conv.userId === user.uuid ? { ...conv, unread: 0 } : conv);
                                                    return newConvs;
                                                });
                                            }
                                        }}
                                    >
                                        <div className="section-user-status">
                                            {user.onlineStatus === 0
                                                ? "🟢"
                                                : user.onlineStatus === 1
                                                    ? "🔴"
                                                    : "🟠"
                                            }
                                        </div>
                                        <p>{user.username} -</p>
                                        <p className="section-user-bio">{user.status}</p>
                                        {userConv?.unread ? <div className="unread-badge">{userConv.unread}</div> : null}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
                <div className="separation-line" />
            </div >
        </DraggableWindow >
    )
}

export default ContactsWindow;