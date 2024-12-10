// useChat.ts
import { fetchMessages } from "@/app/network/api";
import { sendMessageToSocket, useSocket } from "@/app/network/socket";
import { useState, useEffect, useCallback } from "react";
import { Message, User } from "../types";
import { getCookie } from "cookies-next";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);

  // Use socket hook
  const { socket, socketConnected } = useSocket(setChatRoomId, setMessages);

  // Fetch messages from API using the updated api module
  const fetchMessagesFromAPI = useCallback(async () => {
    try {
      const fetchedMessages = await fetchMessages(); // Now using httpClient
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessagesFromAPI();
  }, [fetchMessagesFromAPI]);

  // Send message handler
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage || !chatRoomId) {
      console.error("Cannot send message: Missing content or chatRoomId");
      return;
    }

    const messageData = {
      content: newMessage,
      chatRoomId: chatRoomId,
    };

    // Add the message to the state immediately for local display

    const userName = getCookie("userName") as string;
    const userEmail = getCookie("userEmail") as string;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        content: newMessage,
        sender: {
          name: userName, // Display "You" as the sender's name
          email: userEmail, // Add the current user's email if needed
          isOnline: true, // Set online status if relevant
        } as User, // Ensure this matches your `User` type
        timestamp: new Date().toISOString(),
      },
    ]);

    // Send message via socket
    if (socketConnected) {
      sendMessageToSocket(socket, messageData);
    }

    setNewMessage(""); // Clear input
  };

  // Format timestamp
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
    socket,
    chatRoomId,
  };
};
