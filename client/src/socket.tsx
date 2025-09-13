import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL);