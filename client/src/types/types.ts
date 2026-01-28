type ConnectedUser = {
    uuid: string;
    socketId: string;
    username: string,
    onlineStatus: 0 | 1 | 2;
    avatar: number;
    status: string;
    color: string;
}

type UserDatas = {
    username: string;
    uuid: string;
    status: string;
    onlineStatus: number;
    selectedAvatar: number;
    color: string;
};

type Message = {
    from: string; // user uuid
    to: string; // user uuid
    content: string;
    // color, font, type (event (wizz, wink, disconnection))
}

type ConversationsList = [PublicConversation[] | [], PrivateConversation[] | []];

type PrivateConversation = {
    userId: string;
    unread: number;
    chatHistory: Message[];
}

type PublicConversation = {
    room: string;
    unread: number;
    chatHistory: Message[];
}

type ActiveChat = {
    type: "public" | "private";
    range: number;
    user: ConnectedUser | null;
}

export type {
    UserDatas,
    Message,
    PrivateConversation,
    PublicConversation,
    ConnectedUser,
    ActiveChat,
    ConversationsList
};