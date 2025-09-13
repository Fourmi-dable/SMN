type ConnectedUser = {
    uuid: string;
    socketId: string;
    username: string,
    onlineStatus: 0 | 1 | 2;
    avatar: number;
    status: string;
}

export type { ConnectedUser };