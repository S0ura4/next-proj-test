import { useState, useEffect, useCallback } from "react";
import { Message, User } from "../types";
import { getCookie } from "cookies-next";
import { usePublicChatSocket } from "@/app/network/socket-refactor/publicChat/usePublicChatListeners";
import httpClient from "@/app/network/network";
import {
  joinPublicChat,
  sendMessagePublicChat,
  startPublicChat,
} from "@/app/network/socket-refactor/publicChat/usePublicChatEmitters";

export const usePublicChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);

  // Connect to the public chat namespace
  const socketConnected = usePublicChatSocket(setChatRoomId, setMessages);

  // Fetch messages from the API inline
  const fetchMessagesFromAPI = useCallback(async () => {
    try {
      const response = await httpClient.get("/chat/messages/public-messages");
      const fetchedMessages: Message[] = response.data.data;
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching public messages:", error);
    }
  }, []);

  // Fetch initial messages once
  useEffect(() => {
    fetchMessagesFromAPI();
  }, [fetchMessagesFromAPI]);

  // Once connected, start or join a public chat room
  useEffect(() => {
    if (socketConnected) {
      // Start a public chat room
      startPublicChat();

      // If needed, you can join an existing public chat:
      joinPublicChat();
    }
  }, [socketConnected]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage || !chatRoomId) {
      console.error("Cannot send message: Missing content or chatRoomId");
      return;
    }

    const userName = getCookie("userName") as string;
    const userEmail = getCookie("userEmail") as string;

    // Optimistically update the message list
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        content: newMessage,
        sender: {
          name: userName,
          email: userEmail,
          isOnline: true,
        } as User,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Send the message through the emitter
    sendMessagePublicChat({ content: newMessage, chatRoomId });
    console.log("message sent from client side log");
    // Clear the input
    setNewMessage("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    formatTimestamp,
    chatRoomId,
  };
};
