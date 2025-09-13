import React, { useEffect, useState } from "react";
import { Avatar } from "../components/Avatar";
import type { UserDatas } from "../types";
import logo from "../assets/logo.png";
import groupChatLogo from "../assets/group-chat.png"
import "./Chat.css";
import { DraggableWindow } from "../components/DraggableWindow";
import type { ConnectedUser } from "../types/types";

type ChatProps = {
    userData: UserDatas;
    connectedUserList: ConnectedUser[] | null;
};

export const Chat: React.FC<ChatProps> = ({ userData, connectedUserList }) => {
    const { username, status, onlineStatus, selectedAvatar } = userData;
    const [activeChat, setActiveChat] = useState<{ type: "public" | "private", range: number, user: ConnectedUser | null }>({ type: "public", range: 0, user: null });

    const activeUserData = JSON.parse(localStorage.getItem("SMN-DATA"));

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
                                <p>Salon Principal <span>({connectedUserList ? connectedUserList.length : 0} connectés)</span></p>
                            </div>
                        </section>
                        <section>
                            <div className="section-title">Utilisateurs connectés ({connectedUserList ? connectedUserList.length : 0})</div>
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
            >
                <div className="title-bar" >
                    <div className="title-bar-text">
                        <img src={logo} alt="logo" />
                        <span>SMN Messenger</span> - Chat
                    </div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>
                <div className="window-body has-space" >
                    <div className="conversation-container">
                        <div className="conversation-left">
                            <div className="messages-container">
                                <div className="container-header">
                                    💬 {`Discussion ${activeChat.type === "public" ? 'publique' : 'avec'}`} - <span>{activeChat.user ? activeChat.user.username + ' - ' + activeChat.user.status : "Salon principal"}</span>
                                </div>
                            </div>
                            <div className="chat-input-container">
                                <div className="container-header">
                                    <button>A</button>
                                    <button>😃</button>
                                    <button>😉</button>
                                    <button>😖</button>
                                </div>
                                <div className="chat-input">
                                    <textarea placeholder="Tape ton message..." />
                                    <button >Envoyer</button>
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
                            {/* Mettre ici la liste des utilisateurs connectés sur le chat */}

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