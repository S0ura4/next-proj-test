"use client";
// GroupChat component can also be made responsive for better visibility.

import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";

const GroupChat = () => {
  const { messages, newMessage, setNewMessage, sendMessage, formatTimestamp } =
    useChat(); // Use the custom hook

  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to scroll to the bottom

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom when messages change (new message added)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="public-chat-container bg-gray-700 rounded-md p-4 flex flex-col overflow-y-auto h-full justify-between">
      <h2 className="text-2xl font-semibold text-white mb-6">Public Chat</h2>

      {/* Messages Container with Fixed Height and Scrollable Area */}
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

        {/* The reference div for scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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
