import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

type User = {
    uuid: string; // Ne change pas: pour pouvoir retrouver ses infos si il recharge la page
    socketId: string;
    username: string,
    onlineStatus: 0 | 1 | 2;
    avatar: number;
    status: string;
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

    socket.on('login', (userData) => {
        const { uuid, username, onlineStatus, selectedAvatar, status } = userData;
        console.log('login reçu coté serveur, datas:', userData);
        const userExists = userList.find((user) => user.uuid === uuid);
        if (userExists) {
            userExists.socketId = socket.id;
        } else {
            userList.push({ uuid, socketId: socket.id, username, onlineStatus, avatar: selectedAvatar, status });
        }
        io.emit('connectedUsersList', userList);
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