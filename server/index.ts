import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

type User = {
    uuid: string;
    socketId: string;
    username: string,
    onlineStatus: 0 | 1 | 2;
    avatar: number;
    status: string;
    color: string;
}

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const userList: User[] = [];

io.on('connection', (socket) => {
    console.log('Utilisateur connecté à socket io:', socket.id);
    console.log('Liste des utilisateurs connectés:', userList);

    socket.on('login', (userData) => {
        const { uuid, username, onlineStatus, selectedAvatar, status, color } = userData;
        console.log('login reçu coté serveur, datas:', userData);
        const userExists = userList.find((user) => user.uuid === uuid);
        if (userExists) {
            userExists.socketId = socket.id;
        } else {
            userList.push({
                uuid,
                socketId: socket.id,
                username,
                onlineStatus,
                avatar: selectedAvatar,
                status,
                color
            });
        }
        socket.join("public-room");
        io.emit('connectedUsersList', userList);
        io.to("public-room").emit('message-public-room',
            {
                from: 'system',
                content: `${username} a rejoint le chat!`,
                timestamp: new Date().toISOString()
            });
    });

    socket.on('message-public-room', (message) => {
        io.to("public-room").emit('message-public-room', message);
    });

    socket.on('send-wizz', (to) => {
        console.log('send-wizz reçu coté serveur, to:', to);
        const fromUser = userList.find(user => user.socketId === socket.id);
        const toUser = userList.find(user => user.uuid === to);

        if (to === "public-room") {
            io.to("public-room").emit('receive-wizz', { to: to, from: fromUser })
        } else if (toUser) {
            io.to(toUser.socketId).emit('receive-wizz', { to: toUser, from: fromUser });
            io.to(socket.id).emit('receive-wizz', { to: toUser, from: fromUser });
        }
    });

    socket.on('message-private', (data) => {
        const { to } = data;
        const toUser = userList.find(user => user.uuid === to);
        if (toUser) {
            io.to(toUser.socketId).emit('message-private', data);
            io.to(socket.id).emit('message-private', data);
        }
    });

    socket.on('update-status', (newStatus) => {
        const user = userList.find(user => user.socketId === socket.id);
        if (user) {
            user.onlineStatus = newStatus;
            io.emit('connectedUsersList', userList);
        }
    });

    socket.on('disconnect', () => {
        const userIndex = userList.findIndex(user => user.socketId === socket.id);
        if (userIndex !== -1) {
            userList.splice(userIndex, 1);
            io.emit('connectedUsersList', userList);
        }
    });
});

app.get('/', (_, res) => {
    res.send('Wizz!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});