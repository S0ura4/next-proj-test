import { PublicChatSpace } from "@/app/core/constants/namespace.constants";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { publicChatSocket } from "../socket";
import {
  publicChatEvents,
  socketEvents,
} from "@/app/core/constants/socket.events";
import { Message, User } from "@/app/event/dashboard/types";

export let publicChatSocketConnection: Socket;

export const usePublicChatSocket = (
  setChatRoomId: React.Dispatch<React.SetStateAction<number | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    publicChatSocketConnection = publicChatSocket(
      PublicChatSpace.messagePublicChat
    );

    publicChatSocketConnection.on(socketEvents.connect, () => {
      setSocketConnected(true);
      console.log("Public Chat Socket connected.");
    });

    publicChatSocketConnection.on(socketEvents.connectError, (error) => {
      setSocketConnected(false);
      console.error("Public Chat Socket connection error:", error);
    });

    publicChatSocketConnection.on(
      socketEvents.reconnectAttempt,
      (attempt) => {
        console.log(`Reconnecting... Attempt #${attempt}`);
      }
    );

    publicChatSocketConnection.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    publicChatSocketConnection.on(socketEvents.reconnect, () => {
      console.log("Public Chat Reconnected successfully.");
    });

    publicChatSocketConnection.on(
      publicChatEvents.publicChatStarted,
      (ack: { roomId: number }) => {
        console.log("Public chat started, received roomId:", ack.roomId);
        setChatRoomId(ack.roomId); // Added to use the setChatRoomId parameter
      }
    );

    publicChatSocketConnection.on(
      "receivePublicMessage",
      (message: { from: string; message: string }) => {
        console.log("Received message:", message);

        const sender: User = {
          name: message.from,
          email: "", 
          isOnline: false, 
          avatar: "", 
        };

        setMessages((prevMessages) => [
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

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (publicChatSocketConnection) {
        publicChatSocketConnection.disconnect();
      }
    };
  }, [setChatRoomId, setMessages]);

  return socketConnected;
};