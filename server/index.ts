import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('Utilisateur connecté:', socket.id);

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté:', socket.id);
    });
});

app.get('/', (_, res) => {
    res.send('Wizz!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});