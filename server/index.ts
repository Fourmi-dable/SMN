import http from "http";
import path from "path";
import express from "express";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT || 3000);
const MAX = Number(process.env.MAX_CONNECTIONS || 50);

const app = express();

app.set("trust proxy", 1);

const server = http.createServer(app);

type User = {
    uuid: string;
    socketId: string;
    username: string;
    onlineStatus: 0 | 1 | 2;
    avatar: number;
    status: string;
    color: string;
};

const io = new Server(server, {
    cors: {
        origin: ["https://smn-messenger.fourmi.dev", "https://fun.fourmi.dev"],
        methods: ["GET", "POST"],
    },
});

io.use((socket, next) => {
    const current = io.of("/").sockets.size;
    if (current >= MAX) return next(new Error("server_full"));
    next();
});

const userList: User[] = [];

io.on("connection", (socket) => {
    console.log("Socket connecté:", socket.id, "Total:", io.of("/").sockets.size);

    socket.on("login", (userData) => {
        const { uuid, username, onlineStatus, selectedAvatar, status, color } = userData;

        const userExists = userList.find((u) => u.uuid === uuid);
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
                color,
            });
        }

        socket.join("public-room");
        io.emit("connectedUsersList", userList);
        io.to("public-room").emit("message-public-room", {
            from: "system",
            content: `${username} a rejoint le chat!`,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("message-public-room", (message) => {
        io.to("public-room").emit("message-public-room", message);
    });

    socket.on("send-wizz", (to) => {
        const fromUser = userList.find((u) => u.socketId === socket.id);
        const toUser = userList.find((u) => u.uuid === to);

        if (to === "public-room") {
            io.to("public-room").emit("receive-wizz", { to, from: fromUser });
        } else if (toUser) {
            io.to(toUser.socketId).emit("receive-wizz", { to: toUser, from: fromUser });
            io.to(socket.id).emit("receive-wizz", { to: toUser, from: fromUser });
        }
    });

    socket.on("message-private", (data) => {
        const { to } = data;
        const toUser = userList.find((u) => u.uuid === to);
        if (toUser) {
            io.to(toUser.socketId).emit("message-private", data);
            io.to(socket.id).emit("message-private", data);
        }
    });

    socket.on("update-status", (newStatus) => {
        const user = userList.find((u) => u.socketId === socket.id);
        if (user) {
            user.onlineStatus = newStatus;
            io.emit("connectedUsersList", userList);
        }
    });

    socket.on("disconnect", () => {
        const idx = userList.findIndex((u) => u.socketId === socket.id);
        if (idx !== -1) {
            userList.splice(idx, 1);
            io.emit("connectedUsersList", userList);
        }
    });
});

app.get("/health", (_req, res) => {
    res.json({
        ok: true,
        connectedSockets: io.of("/").sockets.size,
        users: userList.length,
    });
});

const __dirname = path.resolve();
const FRONT_DIR = path.join(__dirname, "../../client/dist");

app.use(express.static(FRONT_DIR));
app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(FRONT_DIR, "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
