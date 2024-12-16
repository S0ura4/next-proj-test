"use client";

import React, { useEffect, useRef } from "react";
import { usePublicChat } from "../hooks/usePublicChat";

const GroupChat = () => {
  const { messages, newMessage, setNewMessage, sendMessage, formatTimestamp } =
    usePublicChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="public-chat-container bg-gray-700 rounded-md p-4 flex flex-col overflow-y-auto h-full justify-between">
      <h2 className="text-2xl font-semibold text-white mb-6">Public Chat</h2>

      <div className="messages-container flex-1 overflow-y-auto mb-4 max-h-[500px] sm:max-h-[600px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message text-white p-4 mb-2 rounded-lg shadow-md ${
              message.sender ? "bg-blue-700" : "bg-gray-600"
            }`}
          >
            <div className="content">
              <strong>
                {message.sender ? message.sender.name : "Unknown"}
              </strong>
              <p>{message.content}</p>
            </div>
            <div className="timestamp text-gray-400 text-sm mt-2">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="p-2 rounded-md w-full bg-gray-600 text-white"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="mt-2 w-full p-2 bg-blue-600 rounded-md text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
