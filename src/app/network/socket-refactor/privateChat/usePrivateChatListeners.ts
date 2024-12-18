"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { privateChatSocket } from "../socket";
import {
  privateChatEvents,
  socketEvents,
} from "@/app/core/constants/socket.events";
import { PrivateChatSpace } from "@/app/core/constants/namespace.constants";

// Keep a reference to the socket connection
export let privateChatSocketConnection: Socket;

export const usePrivateChatSocket = (
  onPrivateChatStarted?: (roomId: number) => void,
  onUserJoined?: (userId: number, roomId: string) => void,
  onReceiveMessage?: (message: { from: number; message: string }) => void,
  onRequestResponse?: (data: unknown) => void,
  onError?: (error: { message: string }) => void
) => {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Connect to the private chat namespace
    privateChatSocketConnection = privateChatSocket(
      PrivateChatSpace.messagePrivateChat
    );

    privateChatSocketConnection.on(socketEvents.connect, () => {
      setSocketConnected(true);
      console.log("Private Chat Socket connected.");
    });

    privateChatSocketConnection.on(socketEvents.connectError, (error) => {
      setSocketConnected(false);
      console.error("Private Chat Socket connection error:", error);
    });

    privateChatSocketConnection.on(socketEvents.disconnect, () => {
      console.log("Private Chat Socket disconnected");
      setSocketConnected(false);
    });

    privateChatSocketConnection.on(socketEvents.reconnectAttempt, (attempt) => {
      console.log(`Reconnecting... Attempt #${attempt}`);
    });

    privateChatSocketConnection.on(socketEvents.reconnect, () => {
      console.log("Private Chat Socket reconnected successfully.");
    });

    // Listeners for private chat events
    privateChatSocketConnection.on(
      privateChatEvents.privateChatStarted,
      (data: { roomId: number }) => {
        console.log("Private chat started:", data);
        if (onPrivateChatStarted) onPrivateChatStarted(data.roomId);
      }
    );

    privateChatSocketConnection.on(
      privateChatEvents.userJoined,
      (data: { userId: number; roomId: string }) => {
        console.log("User joined private chat:", data);
        if (onUserJoined) onUserJoined(data.userId, data.roomId);
      }
    );

    privateChatSocketConnection.on(
      privateChatEvents.receiveMessage,
      (message: { from: number; message: string }) => {
        console.log("Received private message:", message);
        if (onReceiveMessage) onReceiveMessage(message);
      }
    );

    privateChatSocketConnection.on(
      privateChatEvents.requestResponse,
      (data: unknown) => {
        console.log("Received request response:", data);
        if (onRequestResponse) onRequestResponse(data);
      }
    );

    privateChatSocketConnection.on("error", (error: { message: string }) => {
      console.error("Socket error:", error);
      if (onError) onError(error);
    });

    privateChatSocketConnection.on(
      privateChatEvents.requestResponse,
      (data: unknown) => {
        console.log("Received request response:", data);
        if (onRequestResponse) onRequestResponse(data);
      }
    );

    return () => {
      if (privateChatSocketConnection) {
        privateChatSocketConnection.disconnect();
      }
    };
  }, [
    onPrivateChatStarted,
    onUserJoined,
    onReceiveMessage,
    onRequestResponse,
    onError,
  ]);

  return { privateChatSocketConnection, socketConnected };
};

//"use client";

//import { useEffect, useState } from "react";
//import { Socket } from "socket.io-client";
//import { privateChatSocket } from "../socket";
//import { PrivateChatSpace } from "@/app/core/constants/namespace.constants";
//import { socketEvents } from "@/app/core/constants/socket.events";

//// Keep a reference to the socket connection
//export let privateChatSocketConnection: Socket;

//export const usePrivateChatSocket = () => {
//  const [socketConnected, setSocketConnected] = useState(false);

//  useEffect(() => {
//    // Initialize the socket connection to the private chat namespace
//    privateChatSocketConnection = privateChatSocket(
//      PrivateChatSpace.messagePrivateChat
//    );

//    // Listen for the connect event to confirm the connection
//    privateChatSocketConnection.on(socketEvents.connect, () => {
//      setSocketConnected(true);
//      console.log("Private Chat Socket connected.");
//    });

//    // Listen for any connection errors
//    privateChatSocketConnection.on(socketEvents.connectError, (error) => {
//      setSocketConnected(false);
//      console.error("Private Chat Socket connection error:", error);
//    });

//    // Listen for disconnection event
//    privateChatSocketConnection.on(socketEvents.disconnect, () => {
//      setSocketConnected(false);
//      console.log("Private Chat Socket disconnected");
//    });

//    // Cleanup on unmount
//    return () => {
//      if (privateChatSocketConnection) {
//        privateChatSocketConnection.disconnect();
//      }
//    };
//  }, []);

//  return { privateChatSocketConnection, socketConnected };
//};
