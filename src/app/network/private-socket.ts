// privateSocket.ts

import io, { Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import { getCookie } from "cookies-next";
import { InitiateChallengeDto, Message, User } from "../event/dashboard/types";

const PRIVATE_SOCKET_URL = "http://localhost:8080/message-private-chat";

export const usePrivateSocket = (
  setPrivateChatRoomId: React.Dispatch<React.SetStateAction<number | null>>,
  setPrivateMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setUsersInPrivateChat: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const cookieToken = getCookie("authToken") as string;

  const handleSocketEvents = useCallback(
    (socketConnection: Socket) => {
      // Handle connection event
      socketConnection.on("connect", () => {
        setSocketConnected(true);
        console.log("Private socket connected");
      });

      // Handle connection error
      socketConnection.on("connect_error", (error) => {
        console.error("Private socket connection error:", error);
        setSocketConnected(false);
      });

      // Handle disconnection event
      socketConnection.on("disconnect", () => {
        console.log("Private socket disconnected");
        setSocketConnected(false);
      });

      // Handle reconnection attempts
      socketConnection.on("reconnect_attempt", (attempt) => {
        console.log(`Private socket reconnecting... Attempt #${attempt}`);
      });

      // Handle successful reconnection
      socketConnection.on("reconnect", (attempt) => {
        console.log(`Private socket reconnected on attempt #${attempt}`);
        setSocketConnected(true);
      });

      // Handle private chat started
      socketConnection.on("privateChatStarted", (ack: { roomId: number }) => {
        console.log("Private chat started, received roomId:", ack.roomId);
        setPrivateChatRoomId(ack.roomId);
      });

      // Handle user joined
      socketConnection.on(
        "userJoined",
        (data: { userId: number; roomId: number }) => {
          console.log(`User ${data.userId} joined room ${data.roomId}`);
          // Optionally, fetch and update the list of users in the private chat
          // Here, we'll assume you have user data available or fetch it as needed
          setUsersInPrivateChat((prevUsers) => [
            ...prevUsers,
            {
              id: data.userId,
              name: `User ${data.userId}`,
              email: "",
              isOnline: true,
              avatar: "",
            }, // Replace with actual user data
          ]);
        }
      );

      // Handle receiving a private message
      socketConnection.on(
        "receiveMessage",
        (message: { from: number; message: string }) => {
          console.log("Received private message:", message);
          const sender: User = {
            id: message.from,
            name: `User ${message.from}`, // Replace with actual user data if available
            email: "",
            isOnline: true, // Adjust based on actual user status
            avatar: "",
          };

          setPrivateMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              content: message.message,
              sender: sender,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      );

      // Handle challenge received
      socketConnection.on(
        "challengeReceived",
        (payload: InitiateChallengeDto) => {
          console.log("Challenge received:", payload);
          // Prompt the user to accept or reject the challenge
          // Implement a modal or notification to handle this
          // For simplicity, let's assume you auto-accept
          const accept = window.confirm(
            `User ${payload.playerOneId} has challenged you. Do you accept?`
          );
          if (accept) {
            // Emit an event to accept the challenge
            socketConnection.emit(
              "acceptChallenge",
              { ...payload, accepted: true },
              (ack: string) => {
                console.log("Challenge acceptance acknowledgement:", ack);
              }
            );
          } else {
            // Optionally, emit a rejection event
            socketConnection.emit(
              "rejectChallenge",
              { ...payload, accepted: false },
              (ack: string) => {
                console.log("Challenge rejection acknowledgement:", ack);
              }
            );
          }
        }
      );

      // Handle connection status
      socketConnection.on("connectionStatus", (data: { message: string }) => {
        console.log("Connection status:", data.message);
        // Handle connection status as needed
      });

      // Handle errors
      socketConnection.on("error", (error: { message: string }) => {
        console.error("Private socket error:", error.message);
      });
    },
    [setPrivateChatRoomId, setPrivateMessages, setUsersInPrivateChat]
  );

  useEffect(() => {
    const socketConnection = io(PRIVATE_SOCKET_URL, {
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

    // Register event handlers
    handleSocketEvents(socketConnection);

    // Cleanup on unmount
    return () => {
      if (socketConnection) {
        socketConnection.off("connect");
        socketConnection.off("connect_error");
        socketConnection.off("disconnect");
        socketConnection.off("reconnect_attempt");
        socketConnection.off("reconnect");
        socketConnection.off("privateChatStarted");
        socketConnection.off("userJoined");
        socketConnection.off("receiveMessage");
        socketConnection.off("challengeReceived");
        socketConnection.off("connectionStatus");
        socketConnection.off("error");
        // Remove any additional event listeners here

        socketConnection.disconnect();
      }
    };
  }, [cookieToken, handleSocketEvents]);

  return { socket, socketConnected };
};
