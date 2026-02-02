import messageSound from "../assets/sounds/new_message.mp3";
import type { PrivateConversation, PublicConversation } from "../types/types";
const audio = new Audio(messageSound);

const publicMessageListener = (socket, activeUserData, activeChat, setConversations, isMobile) => {
    socket.on('message-public-room', (message) => {
        setConversations((prevConversations) => {
            let newConvs: [PublicConversation[], PrivateConversation[]] = [
                prevConversations[0].map((conv, id) =>
                    id === 0
                        ? {
                            ...conv,
                            unread: isMobile ? conv.unread + 1 : activeChat.type === "public" ? 0 : conv.unread + 1,
                            chatHistory: [...conv.chatHistory, message]
                        }
                        : conv
                ),
                prevConversations[1]
            ];

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
}

const privateMessageListener = (socket, activeUserData, activeChat, setConversations, isMobile) => {

    socket.on('message-private', (message) => {
        setConversations((prevConversations) => {
            const isFromActiveUser = message.from === activeUserData.uuid;
            const hasAlreadyRead = (activeChat.type === "private" && activeChat.user && activeChat.user.uuid === (isFromActiveUser ? message.to : message.from));
            let newConvs = [...prevConversations];

            let privateConv = newConvs[1].find(conv => conv.userId === (isFromActiveUser ? message.to : message.from));
            if (!privateConv) {
                privateConv = { userId: isFromActiveUser ? message.to : message.from, chatHistory: [] };
                newConvs[1].push(privateConv);
            }
            privateConv.chatHistory = [...privateConv.chatHistory, message];

            privateConv.unread = isFromActiveUser ? 0 : isMobile ? privateConv.unread + 1 : hasAlreadyRead ? 0 : privateConv.unread ? privateConv.unread + 1 : 1;

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
    })
}

export { publicMessageListener, privateMessageListener };