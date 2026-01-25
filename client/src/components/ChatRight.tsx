import type { ActiveChat, ConnectedUser } from "../types/types"
import { Avatar } from "./Avatar"

const ChatRight = ({ activeChat, connectedUsers, onlineStatus, selectedAvatar }:
    {
        activeChat: ActiveChat,
        connectedUsers: ConnectedUser[] | null,
        onlineStatus: number,
        selectedAvatar: number
    }) => {
    return (
        <div className="conversation-right">
            {activeChat.type === "private" ? (
                <Avatar
                    onlineStatus={activeChat.user.onlineStatus}
                    selectedAvatar={activeChat.user.avatar}
                    size="xlarge"
                />
            ) : (
                <div className="public-chat">
                    <p className="connected-users">Utilisateurs connectés:</p>
                    <div className="section-content">
                        {connectedUsers?.map((user) => (
                            <div className="section-user-connected" key={user.uuid}>
                                <div className="section-user-status">
                                    {user.onlineStatus === 0 ? "🟢" : user.onlineStatus === 1 ? "🔴" : "🟠"}
                                </div>
                                <p>{user.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Avatar onlineStatus={onlineStatus} selectedAvatar={selectedAvatar} size="xlarge" />
        </div>
    )
}

export default ChatRight