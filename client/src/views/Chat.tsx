import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../components/Avatar";
import type { UserDatas } from "../types";
import logo from "../assets/logo.png";
import sound from "../assets/sounds/new_message.mp3";
import wizzSound from "../assets/sounds/wizz.mp3";
import groupChatLogo from "../assets/group-chat.png"
import "./Chat.css";
import { DraggableWindow } from "../components/DraggableWindow";
import type { ConnectedUser } from "../types/types";
import { socket } from '../socket.tsx'

type ChatProps = {
    userData: UserDatas;
    connectedUserList: ConnectedUser[] | null;
};

type Message = {
    from: string; // user uuid
    to: string; // user uuid
    content: string;
    // color, font, type (event (wizz, wink, disconnection))
}

type PrivateConversation = {
    userId: string;
    chatHistory: Message[];
}

type PublicConversation = {
    room: string;
    chatHistory: Message[];
}

const disconnect = () => {
    localStorage.removeItem("SMN-DATA");
    socket.disconnect();
    window.location.reload();
}

export const Chat: React.FC<ChatProps> = ({ userData, connectedUserList }) => {
    const { username, status, onlineStatus, selectedAvatar } = userData;
    const [activeChat, setActiveChat] = useState<{ type: "public" | "private", range: number, user: ConnectedUser | null }>({ type: "public", range: 0, user: null });
    const [conversations, setConversations] = useState<[PublicConversation[] | [], PrivateConversation[] | []]>([[{ room: "public-room", chatHistory: [] }], [{ userId: "", chatHistory: [] }]]);
    const [messageInput, setMessageInput] = useState<string>("");
    const messagesContentRef = useRef<HTMLDivElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const [canSendWizz, setCanSendWizz] = useState(true);

    const activeUserData = JSON.parse(localStorage.getItem("SMN-DATA"));

    useEffect(() => {
        // Scroll en bas du chat à chaque nouveau message
        if (messagesContentRef.current) {
            messagesContentRef.current.scrollTop = messagesContentRef.current.scrollHeight;
        }
    }, [conversations]);

    useEffect(() => {
        const audio = new Audio(sound);

        // recuperer les conversations sauvegardées en local
        const savedData = localStorage.getItem("SMN-DATA");
        if (savedData) {
            const { conversationList } = JSON.parse(savedData);
            if (conversationList) {
                setConversations(conversationList);
            }
        }

        socket.on('message-public-room', (message) => {
            console.log('Nouveau message dans le canal public-room:', message);
            setConversations((prevConversations) => {
                let newConvs = [...prevConversations];
                newConvs[0] = [...newConvs[0]];
                newConvs[0][0] = { ...newConvs[0][0], chatHistory: [...newConvs[0][0].chatHistory, message] };

                const updatedData = {
                    ...JSON.parse(localStorage.getItem('SMN-DATA') || '{}'),
                    conversationList: newConvs
                };
                localStorage.setItem('SMN-DATA', JSON.stringify(updatedData));

                return newConvs;
            });

            if (message.from !== activeUserData.uuid) {
                audio.play();
            }
        });

        socket.on('message-private', (message) => {
            console.log('Nouveau message privé reçu:', message);
            setConversations((prevConversations) => {
                let newConvs = [...prevConversations];
                newConvs[1] = [...newConvs[1]];
                let privateConv = newConvs[1].find(conv => conv.userId === (message.from === activeUserData.uuid ? message.to : message.from));
                if (!privateConv) {
                    privateConv = { userId: message.from === activeUserData.uuid ? message.to : message.from, chatHistory: [] };
                    newConvs[1].push(privateConv);
                }
                privateConv.chatHistory = [...privateConv.chatHistory, message];

                const updatedData = {
                    ...JSON.parse(localStorage.getItem('SMN-DATA') || '{}'),
                    conversationList: newConvs
                };
                localStorage.setItem('SMN-DATA', JSON.stringify(updatedData));

                return newConvs;
            });

            if (message.from !== activeUserData.uuid && document.hidden) {
                audio.play();
            }

            //Mettre à jour le compte de messages non lus
        })

        return () => {
            socket.off('message-public-room');
            socket.off('message-private')
        };
    }, []);

    console.log(conversations);

    const findUserByUuid = (uuid: string): ConnectedUser | null => {
        if (!connectedUserList) return null;
        const user = connectedUserList.find(user => user.uuid === uuid);
        return user || null;
    }

    const handleSendMessage = () => {
        if (messageInput.trim() === "") return;

        const message: Message = {
            from: activeUserData.uuid,
            to: activeChat.type === "private" && activeChat.user ? activeChat.user.uuid : "public-room",
            content: messageInput.trim(),
        };

        console.log("Envoi du message:", message);

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

    const sendWizz = () => {
        const wizz = new Audio(wizzSound);

        if (!canSendWizz) {
            alert("Veuillez attendre avant d'envoyer un autre Wizz.");
            return;
        }
        setCanSendWizz(false);
        setTimeout(() => setCanSendWizz(true), 5000);
        wizz.play();
        chatWindowRef.current?.classList.add("wizz-animation");
        setTimeout(() => {
            chatWindowRef.current?.classList.remove("wizz-animation");
        }, 1000);
    }

    return (
        <div className="chat-view" >
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
                            <div className="info small" ><div className="status-select">
                                <label htmlFor="online">Statut:</label>
                                <select id="online" value={onlineStatus} onChange={() => { }}>
                                    <option value={0}>🟢 En ligne</option>
                                    <option value={1}>🔴 Occupé</option>
                                    <option value={2}>🟠 Ailleurs</option>
                                </select>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="separation-line" />
                    <div className="chat-sections-container" >
                        <div className="section-title">Discussions en cours (0)</div>
                        <section>
                            <div className="section-title">Salons Publics (1)</div>
                            <div
                                className={`section-content group-chat-container ${activeChat.type === "public" && activeChat.range === 0 && "selected"}`}
                                onClick={() => setActiveChat({ type: "public", range: 0, user: null })}
                            >
                                <img src={groupChatLogo} />
                                <p>Salon Principal <span>({connectedUserList ? (connectedUserList.length - 1) : 0} connectés)</span></p>
                            </div>
                        </section>
                        <section>
                            <div className="section-title">Utilisateurs connectés ({connectedUserList ? (connectedUserList.length - 1) : 0})</div>
                            <div className="section-content user-list-container">
                                {connectedUserList && connectedUserList.filter(user => user.uuid !== activeUserData.uuid).map((user, id) =>
                                    <div className={`section-user-connected ${activeChat.type === "private" && activeChat.range === id && "selected"}`} key={id} onClick={() => setActiveChat({ type: "private", range: id, user: user })}>
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
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className="separation-line" />
                </div >
            </DraggableWindow >
            <DraggableWindow
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
                                            <div style={{ color: findUserByUuid(message.from)?.color, fontSize: "16px" }}>{findUserByUuid(message.from) ? findUserByUuid(message.from)?.username + ` : ${message.content}` : <span style={{ color: "gray" }}>{message.content}</span>}</div>
                                        )
                                        :
                                        conversations[1].find(conv => conv.userId === (activeChat.user ? activeChat.user.uuid : ""))?.chatHistory.map((message) =>
                                            <div style={{ color: findUserByUuid(message.from)?.color, fontSize: "16px" }}>{findUserByUuid(message.from) ? findUserByUuid(message.from)?.username + ` : ${message.content}` : message.content}</div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="chat-input-container">
                                <div className="container-header">
                                    <button>A</button>
                                    <button>😃</button>
                                    <button>😉</button>
                                    <button onClick={sendWizz}>😖</button>
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
                                        {connectedUserList && connectedUserList.map((user, id) =>
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
            </DraggableWindow >
        </div >
    );
}