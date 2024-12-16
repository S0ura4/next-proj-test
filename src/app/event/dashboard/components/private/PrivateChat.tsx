"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSocketStatus } from "@/app/network/private-socket";

const PrivateChat = () => {
  const { socket, socketConnected } = useSocketStatus();
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message: string) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && inputMessage.trim()) {
      socket.emit("sendMessage", inputMessage);
      setMessages((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Private Chat</h2>

      {socketConnected ? (
        <div>
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
            >
              Send
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Disconnected from private chat server.</p>
      )}
    </div>
  );
};

export default PrivateChat;
