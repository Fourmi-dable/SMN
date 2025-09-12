import React from "react";
import { Avatar } from "../components/Avatar";
import type { UserDatas } from "../types";
import logo from "../assets/logo.png";
import "./Chat.css";
import { DraggableWindow } from "../components/DraggableWindow";

type ChatProps = {
    userData: UserDatas;
};

export const Chat: React.FC<ChatProps> = ({ userData }) => {
    const { username, status, onlineStatus, selectedAvatar } = userData;

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
                        <div className="section-title">Salons Publics (0)</div>
                        <div className="section-title">Utilisateurs connectés (0)</div>
                    </div>
                    <div className="separation-line" />
                </div>
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
                                    💬 Discussion avec<span>Jojo</span>
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
                            <Avatar onlineStatus={2} selectedAvatar={17} size="xlarge" />
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