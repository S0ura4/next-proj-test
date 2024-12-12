import io, { Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import { getCookie } from "cookies-next";

const SOCKET_URL = "http://localhost:8080/message-private-chat";

export const useSocketStatus = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const cookieToken = getCookie("authToken") as string;

  const handleSocketEvents = useCallback((socketConnection: Socket) => {
    socketConnection.on("connect", () => {
      setSocketConnected(true);
      console.log("Private Socket connected.");
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Private Socket connection error:", error);
      setSocketConnected(false);
    });

    socketConnection.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting... Attempt #${attempt}`);
    });

    socketConnection.on("reconnect", () => {
      console.log("Private Reconnected successfully.");
      setSocketConnected(true);
    });

    socketConnection.emit(
      "startPrivateChat",
      (ack: { id: number; reciever: number }) => {
        console.log("Private chat started:", ack);
      }
    );

    socketConnection.on("privateChatStarted", (ack: { roomId: number }) => {
      console.log("Private chat started, received roomId:", ack.roomId);
    });

    socketConnection.on("disconnect", () => {
      console.log("Private Socket disconnected.");
      setSocketConnected(false);
    });
  }, []);

  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${cookieToken}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    setSocket(socketConnection);
    handleSocketEvents(socketConnection);

    return () => {
      socketConnection.off("connect");
      socketConnection.off("connect_error");
      socketConnection.off("reconnect_attempt");
      socketConnection.off("reconnect");
      socketConnection.off("userOnline");
      socketConnection.off("userOffline");
      socketConnection.off("disconnect");
      socketConnection.disconnect();
    };
  }, [cookieToken, handleSocketEvents]);

  return { socket, socketConnected };
};
