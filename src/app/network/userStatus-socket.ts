import io, { Socket } from "socket.io-client";
import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { getCookie } from "cookies-next";
import { User } from "../event/dashboard/types";

//const SOCKET_URL = "http://localhost:8080/user-status";
const SOCKET_URL = "http://localhost:8080/message-public-chat";

export const useSocketStatus = (setUsers: Dispatch<SetStateAction<User[]>>) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const cookieToken = getCookie("authToken") as string;

  const handleSocketEvents = useCallback(
    (socketConnection: Socket) => {
      socketConnection.on("connect", () => {
        setSocketConnected(true);
        console.log("Socket connected.");
      });

      socketConnection.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setSocketConnected(false);
      });

      socketConnection.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnecting... Attempt #${attempt}`);
      });

      socketConnection.on("reconnect", () => {
        console.log("Reconnected successfully.");
        setSocketConnected(true);
      });

      socketConnection.on("userOnline", (userId: number) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isOnline: true } : user
          )
        );
      });

      socketConnection.on("userOffline", (userId: number) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isOnline: false } : user
          )
        );
      });

      socketConnection.on("disconnect", () => {
        console.log("Socket disconnected.");
        setSocketConnected(false);
      });
    },
    [setUsers]
  );

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
