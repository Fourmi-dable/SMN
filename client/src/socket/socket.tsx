import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'https://smn-messenger.fourmi.dev' ? '' : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL);