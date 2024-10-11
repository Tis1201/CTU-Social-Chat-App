import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { localhost } from '../app/constants/localhost'; // Điều chỉnh đường dẫn nếu cần

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(localhost, {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
    newSocket.on('postUpdated', (postId) => {
      console.log(`Post with ID ${postId} has been updated.`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    socket,
    emit: (event: any, data: any) => socket?.emit(event, data),
  };
};

export default useSocket;
