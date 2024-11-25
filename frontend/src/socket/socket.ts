import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { localhost } from "../app/constants/localhost";
import {
  deleteToken,
  getToken,
  getUserIdFromToken,
  saveToken,
} from "../app/utils/secureStore";
import { useRefreshToken } from "../hooks/refreshtoken";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { data: refreshToken } = useRefreshToken();

  useEffect(() => {
    const connectSocket = async () => {
      const tokenValue = await getToken();
      const uid = await getUserIdFromToken();
      setToken(tokenValue);

      const newSocket = io(localhost, {
        autoConnect: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("login", uid);
      });

      newSocket.on("connect_error", async (error) => {
        console.error("Connection error:", error);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        if (uid) {
          newSocket.emit("userDisconnected", uid);
          console.log("User ID sent on disconnect:", uid);
        }
      });

      const heartbeatInterval = setInterval(() => {
        if (newSocket.connected) {
          newSocket.emit("heartbeat", { userId: uid });
        }
      }, 5000);

      newSocket.on("postUpdated", (postId) => {
        console.log(`Post with ID ${postId} has been updated.`);
      });

      newSocket.on("tokenExpired", async (data) => {
        console.error(data.message);
        const newToken = refreshToken?.data?.accessToken;
        if (newToken) {
          await saveToken(newToken);
          console.log("New token obtained:", newToken);
          if (newSocket.io.opts.query) {
            newSocket.io.opts.query.token = newToken;
          }
          newSocket.connect();
        }
      });

      setSocket(newSocket);

      return () => {
        clearInterval(heartbeatInterval); // Xóa interval khi component bị hủy
        newSocket.disconnect();
      };
    };

    connectSocket();
  }, [refreshToken]);

  const emit = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return {
    socket,
    emit,
    token,
  };
};

export default useSocket;
