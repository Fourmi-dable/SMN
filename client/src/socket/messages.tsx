import messageSound from "../assets/sounds/new_message.mp3";
const audio = new Audio(messageSound);

const publicMessageListener = (socket, activeUserData, activeChat, setConversations) => {
    socket.on('message-public-room', (message) => {
        console.log('Nouveau message dans le canal public-room:', message);
        setConversations((prevConversations) => {
            let newConvs = [...prevConversations];
            newConvs[0] = [...newConvs[0]];
            newConvs[0][0] = { ...newConvs[0][0], unread: activeChat.type !== "public" ? newConvs[0][0].unread + 1 : newConvs[0][0].unread, chatHistory: [...newConvs[0][0].chatHistory, message] };

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

const privateMessageListener = (socket, activeUserData, activeChat, setConversations) => {

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

            privateConv.unread = (activeChat.type === "private" && activeChat.user && activeChat.user.uuid === privateConv.userId) ? privateConv.unread : privateConv.unread + 1;

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