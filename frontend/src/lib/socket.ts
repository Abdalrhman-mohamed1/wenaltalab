import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false, // We connect manually when logged in
  transports: ['websocket'],
});

// Helper to init socket with JWT
export const initSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
