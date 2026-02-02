import { createContext, useContext, useEffect, useState } from "react";
import type { ConnectedUser, UserDatas } from "../types/types";
import { socket } from "../socket/socket";

const defaultUserData = {
    username: "",
    uuid: "",
    status: "",
    onlineStatus: 0,
    selectedAvatar: 0,
    color: ""
};

const defaultUserDataContext = {
    userData: defaultUserData as UserDatas | null,
    setUserData: (() => { }) as React.Dispatch<React.SetStateAction<UserDatas | null>>,
    connectedUsers: [] as ConnectedUser[] | null,
};

const UserDataContext = createContext(defaultUserDataContext);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<UserDatas | null>(null);
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[] | null>(null);

    useEffect(() => {
        function getConnectedUsers(userList: ConnectedUser[]) {
            setConnectedUsers(userList);
        }

        socket.on('connectedUsersList', getConnectedUsers);
        return () => {
            socket.off('connectedUsersList', getConnectedUsers);
        };
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, connectedUsers }}>
            {children}
        </UserDataContext.Provider>
    );
};

export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return {
        userData: context.userData,
        setUserData: context.setUserData,
        connectedUsers: context.connectedUsers
    };
}