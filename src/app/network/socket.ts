import io, { Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import { getCookie } from "cookies-next";
import { Message, User } from "../event/dashboard/types";

const SOCKET_URL = "http://localhost:8080/message-public-chat";

export const useSocket = (
  setChatRoomId: React.Dispatch<React.SetStateAction<number | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const cookieToken = getCookie("authToken") as string;

  const handleSocketEvents = useCallback(
    (socketConnection: Socket) => {
      // Handle connection event
      socketConnection.on("connect", () => {
        setSocketConnected(true);
        console.log("Socket connected");
      });

      // Handle connection error
      socketConnection.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setSocketConnected(false);
      });

      // Handle disconnection event
      socketConnection.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      // Handle reconnection attempts
      socketConnection.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnecting... Attempt #${attempt}`);
      });

      // Handle successful reconnection
      socketConnection.on("reconnect", (attempt) => {
        console.log(`Reconnected successfully on attempt #${attempt}`);
        setSocketConnected(true);
      });

      // Handle public chat and room joining
      socketConnection.emit("startPublicChat", (ack: string) => {
        console.log("Public chat started:", ack);
      });

      socketConnection.on("publicChatStarted", (ack: { roomId: number }) => {
        console.log("Public chat started, received roomId:", ack.roomId);
        setChatRoomId(ack.roomId);
      });

      socketConnection.emit("joinPublicChat", (ack: string) => {
        console.log("Joined public chat:", ack);
      });

      socketConnection.on(
        "receivePublicMessage",
        (message: { from: string; message: string }) => {
          console.log("Received message:", message);

          // Assuming you have a function to fetch the user by `from` (the user's name or ID)
          const sender: User = {
            name: message.from, // or fetch the name if needed
            email: "", // You may want to fetch the email if available
            isOnline: false, // Set based on your app's logic or status
            avatar: "", // Set based on your app's logic or status
          };

          // Add the message to the state with the correct sender object
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              content: message.message,
              sender: sender, // Correctly assign sender as a User object
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      );
    },
    [setChatRoomId, setMessages]
  );

  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${cookieToken}`,
      },
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: Infinity, // Infinite attempts to reconnect
      reconnectionDelay: 1000, // Wait 1 second between reconnection attempts
      reconnectionDelayMax: 5000, // Max delay of 5 seconds
      randomizationFactor: 0.5, // Randomize the delay
    });

    setSocket(socketConnection);

    // Register events when socket is initialized or reconnected
    handleSocketEvents(socketConnection);

    // Cleanup socket on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [cookieToken, handleSocketEvents]);

  return { socket, socketConnected };
};

export const sendMessageToSocket = (
  socket: Socket | null,
  messageData: { content: string; chatRoomId: number }
) => {
  if (socket) {
    socket.emit("sendPublicMessage", messageData, (ack: string) => {
      console.log("Message sent:", ack);
    });
  }
};
