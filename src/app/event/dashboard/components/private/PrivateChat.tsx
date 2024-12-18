"use client";

import {
  joinPrivateChat,
  sendPrivateMessage,
  startPrivateChat,
} from "@/app/network/socket-refactor/privateChat/usePrivateChatEmitters";
import { usePrivateChatSocket } from "@/app/network/socket-refactor/privateChat/usePrivateChatListeners";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PrivateChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  const { socketConnected } = usePrivateChatSocket(
    (roomId) => {
      setCurrentRoomId(roomId);
      console.log("Private chat started with roomId:", roomId);
    },
    (userId, roomId) => {
      console.log(`User ${userId} joined private chat room: ${roomId}`);
      setMessages((prev) => [...prev, `User ${userId} joined room ${roomId}`]);
    },
    (message) => {
      const formattedMessage = `${message.from}: ${message.message}`;
      setMessages((prev) =>
        prev.includes(formattedMessage) ? prev : [...prev, formattedMessage]
      );
    },
    (data) => {
      console.log("Received alert request response:", data);
    },
    (error) => {
      console.error("Received error:", error);
    }
  );

  const handleStartChat = () => {
    startPrivateChat({ receiver: 2 });
  };

  const handleJoinChat = () => {
    if (currentRoomId) {
      joinPrivateChat(currentRoomId);
    } else {
      console.error("No valid room ID to join.");
    }
  };

  const handleSendMessage = () => {
    if (currentRoomId && inputMessage.trim()) {
      sendPrivateMessage({ chatRoomId: currentRoomId, content: inputMessage });
      setMessages((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    } else {
      console.error("Cannot send message: Missing room ID or message content.");
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Private Chat</h2>

      {socketConnected ? (
        <>
          <div className="space-x-2 mb-4">
            <Button
              variant="default"
              onClick={handleStartChat}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Start Private Chat
            </Button>
            <Button
              variant="default"
              onClick={handleJoinChat}
              className="bg-green-600 hover:bg-green-500"
              disabled={!currentRoomId}
            >
              Join Private Chat
            </Button>
          </div>

          <div className="border border-gray-700 p-4 h-64 overflow-y-auto rounded-md bg-gray-900">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <p key={index} className="text-sm">
                  {msg}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
          </div>

          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message"
            />
            <Button
              variant="default"
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-500"
              disabled={!currentRoomId || inputMessage.trim() === ""}
            >
              Send
            </Button>
          </div>
        </>
      ) : (
        <p className="text-red-500">Disconnected from private chat server.</p>
      )}
    </div>
  );
};

export default PrivateChat;

//"use client";

//import { usePrivateChatSocket } from "@/app/network/socket-refactor/privateChat/usePrivateChatListeners";

//const PrivateChat = () => {
//  const { socketConnected } = usePrivateChatSocket();

//  return (
//    <div>
//      <h2>Private Chat</h2>
//      {socketConnected ? (
//        <p>Connected to private chat server.</p>
//      ) : (
//        <p>Disconnected from private chat server.</p>
//      )}
//    </div>
//  );
//};

//export default PrivateChat;
