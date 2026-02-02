import messageSound from "../assets/sounds/new_message.mp3";
const audio = new Audio(messageSound);

const updateConversations = (setConversations, updater) => {
    setConversations((prev) => {
        const newConvs = updater(prev);
        const updatedData = {
            ...JSON.parse(localStorage.getItem('SMN-DATA') || '{}'),
            conversationList: newConvs
        };
        localStorage.setItem('SMN-DATA', JSON.stringify(updatedData));
        return newConvs;
    });
};

const calculateUnread = (isOwnMessage: boolean, isMobile: boolean, isActiveChat: boolean, currentUnread: number = 0): number => {
    if (isOwnMessage) return 0;
    if (isMobile) return currentUnread + 1;
    if (isActiveChat) return 0;
    return currentUnread + 1;
};

const playSound = (sound: HTMLAudioElement) => {
    try {
        sound.play();
    } catch (error) {
        console.warn('Erreur de lecture audio:', error);
    }
};
const publicMessageListener = (socket, activeUserData, activeChat, setConversations, isMobile, canSendWizz, setCanSendWizz, chatWindowRef) => {
    socket.on('message-public-room', (message) => {
        updateConversations(setConversations, (prev) => [
            prev[0].map((conv, id) =>
                id === 0
                    ? {
                        ...conv,
                        unread: calculateUnread(message.from === activeUserData.uuid, isMobile, activeChat.type === "public", conv.unread),
                        chatHistory: [...conv.chatHistory, message]
                    }
                    : conv
            ),
            prev[1]
        ]);

        if (message.from !== activeUserData.uuid) {
            playSound(audio);
        }
    });

    socket.on('receive-wizz', ({ from, to }) => {
        const wizz = new Audio(new URL('../assets/sounds/wizz.mp3', import.meta.url));
        console.log("receive-wizz", from, to);
        if (to === "public-room") {
            updateConversations(setConversations, (prev) => [
                prev[0].map((conv, id) =>
                    id === 0
                        ? {
                            ...conv,
                            unread: calculateUnread(false, isMobile, activeChat.type === "public", conv.unread),
                            chatHistory: [...conv.chatHistory, { from: 'system', content: `${from.username} a envoyé un Wizz !`, timestamp: new Date().toISOString() }]
                        }
                        : conv
                ),
                prev[1]
            ]);
        } else {
            updateConversations(setConversations, (prev) => {
                const isFromActiveUser = from.uuid === activeUserData.uuid;
                const targetUserId = isFromActiveUser ? to.uuid : from.uuid;
                const newConvs = [...prev];
                let privateConv = newConvs[1].find(conv => conv.userId === targetUserId);
                if (!privateConv) {
                    privateConv = { userId: targetUserId, chatHistory: [], unread: 0 };
                    newConvs[1].push(privateConv);
                }
                privateConv.chatHistory = [...privateConv.chatHistory, { from: "system", content: `${from.username} a envoyé un Wizz !`, timestamp: new Date().toISOString() }];
                privateConv.unread = calculateUnread(false, isMobile, activeChat.type === "private" && activeChat.user?.uuid === targetUserId, privateConv.unread);
                return newConvs;
            });
        }

        playSound(wizz);
        if (chatWindowRef?.current) {
            chatWindowRef.current.classList.add("wizz-animation");
            setTimeout(() => chatWindowRef.current?.classList.remove("wizz-animation"), 1000);
        }
    });
}

const privateMessageListener = (socket, activeUserData, activeChat, setConversations, isMobile) => {
    socket.on('message-private', (message) => {
        updateConversations(setConversations, (prev) => {
            const isFromActiveUser = message.from === activeUserData.uuid;
            const targetUserId = isFromActiveUser ? message.to : message.from;
            const hasAlreadyRead = activeChat.type === "private" && activeChat.user?.uuid === targetUserId;
            const newConvs = [...prev];

            let privateConv = newConvs[1].find(conv => conv.userId === targetUserId);
            if (!privateConv) {
                privateConv = { userId: targetUserId, chatHistory: [], unread: 0 };
                newConvs[1].push(privateConv);
            }
            privateConv.chatHistory = [...privateConv.chatHistory, message];
            privateConv.unread = calculateUnread(isFromActiveUser, isMobile, hasAlreadyRead, privateConv.unread);

            return newConvs;
        });

        if (message.from !== activeUserData.uuid && document.hidden) {
            playSound(audio);
        }
    });
};

export { publicMessageListener, privateMessageListener };