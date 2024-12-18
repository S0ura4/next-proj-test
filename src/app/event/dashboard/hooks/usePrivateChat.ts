"use client";

import { useState, useCallback } from "react";

import { usePrivateChatSocket } from "@/app/network/socket-refactor/privateChat/usePrivateChatListeners";
import {
  joinPrivateChat,
  sendAlertRequest,
  sendChallengeResponse,
  sendPrivateMessage,
  startPrivateChat,
} from "@/app/network/socket-refactor/privateChat/usePrivateChatEmitters";

export const usePrivateChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [challengeAccepted, setChallengeAccepted] = useState<boolean | null>(
    null
  );

  // Initialize private chat socket
  const { socketConnected } = usePrivateChatSocket(
    (roomId) => {
      console.log("Private chat started with room ID:", roomId);
      setChatRoomId(roomId);
    },
    (userId, roomId) => {
      console.log(`User ${userId} joined room ${roomId}`);
    },
    (message) => {
      console.log("New private message received:", message);
    },
    (response: any) => {
      console.log("Request response received:", response);
      if (response.message === true || response.message === false) {
        setChallengeAccepted(response.message);
      }
    },
    (error) => {
      console.error("Error occurred in private chat:", error.message);
    }
  );

  // Start a private chat with a specific user
  const initiatePrivateChat = useCallback(
    (receiverId: number) => {
      if (!socketConnected) {
        console.error("Socket not connected. Cannot start private chat.");
        return;
      }
      startPrivateChat({ receiver: receiverId });
    },
    [socketConnected]
  );

  // Join an existing private chat room
  const joinRoom = useCallback(
    (roomId: number) => {
      if (!socketConnected) {
        console.error("Socket not connected. Cannot join room.");
        return;
      }
      joinPrivateChat(roomId);
    },
    [socketConnected]
  );

  // Send a private message in the chat
  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!newMessage || !chatRoomId) {
        console.error("Cannot send message: Missing content or chatRoomId");
        return;
      }

      sendPrivateMessage({ chatRoomId, content: newMessage });
      console.log("Message sent:", newMessage);
      setNewMessage(""); // Clear the input field
    },
    [newMessage, chatRoomId]
  );

  // Send a challenge request to another player
  const sendChallenge = useCallback(
    (playerTwoId: number) => {
      if (!socketConnected) {
        console.error("Socket not connected. Cannot send challenge.");
        return;
      }
      sendAlertRequest({ playerTwoId, accepted: false });
    },
    [socketConnected]
  );

  // Handle challenge response (accept or decline)
  const respondToChallenge = useCallback(
    (playerOneId: number, playerTwoId: number, accepted: boolean) => {
      if (!socketConnected) {
        console.error("Socket not connected. Cannot respond to challenge.");
        return;
      }
      sendChallengeResponse({ playerOneId, playerTwoId, accepted });
      setChallengeAccepted(accepted);
    },
    [socketConnected]
  );

  return {
    socketConnected,
    newMessage,
    setNewMessage,
    sendMessage,
    chatRoomId,
    initiatePrivateChat,
    joinRoom,
    sendChallenge,
    respondToChallenge,
    challengeAccepted,
  };
};

//"use client";

//import { useEffect, useState } from "react";
//import { Socket } from "socket.io-client";
//import { PrivateChatSpace } from "@/app/core/constants/namespace.constants";
//import { socketEvents } from "@/app/core/constants/socket.events";
//import { privateChatSocket } from "@/app/network/socket-refactor/socket";

//export let privateChatSocketConnection: Socket;

//// This is a custom React Hook
//export const usePrivateChatSocket = () => {
//  const [socketConnected, setSocketConnected] = useState(false);

//  useEffect(() => {
//    // Initialize the socket
//    privateChatSocketConnection = privateChatSocket(
//      PrivateChatSpace.messagePrivateChat
//    );

//    privateChatSocketConnection.on(socketEvents.connect, () => {
//      setSocketConnected(true);
//      console.log("Private Chat Socket connected.");
//    });

//    privateChatSocketConnection.on(socketEvents.disconnect, () => {
//      setSocketConnected(false);
//      console.log("Private Chat Socket disconnected");
//    });

//    return () => {
//      if (privateChatSocketConnection) {
//        privateChatSocketConnection.disconnect();
//      }
//    };
//  }, []);

//  return { privateChatSocketConnection, socketConnected };
//};
