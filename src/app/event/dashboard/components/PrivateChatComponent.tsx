// PrivateChatComponent.tsx

import React, { useState, useEffect } from "react";
import { usePrivateSocket } from "@/app/network/private-socket";
import {
  sendPrivateMessage,
  startPrivateChat,
  acceptChallenge,
  rejectChallenge,
} from "../hooks/privateRequest";
import {
  ChatRoomDto,
  InitiateChallengeDto,
  Message,
  MessageDto,
} from "../types";
import ChallengeModal from "./ChallangeModal";

const PrivateChatComponent: React.FC = () => {
  const [privateChatRoomId, setPrivateChatRoomId] = useState<number | null>(
    null
  );
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [incomingChallenge, setIncomingChallenge] =
    useState<InitiateChallengeDto | null>(null);

  const { socket, socketConnected } = usePrivateSocket(
    setPrivateChatRoomId,
    setPrivateMessages,
    () => {} // Dummy function since setUsersInPrivateChat was removed
  );

  useEffect(() => {
    if (socketConnected && privateChatRoomId) {
      // Optionally, perform actions when connected and chat room is set
      console.log(`Connected to private chat room ID: ${privateChatRoomId}`);
    }
  }, [socketConnected, privateChatRoomId]);

  const handleStartChat = (recieverId) => {
    const payload: ChatRoomDto = {
      receiver: recieverId, // Replace with the actual receiver's user ID
      name: "Private Chat with User 2", // Optional: Provide a name for the chat room
    };

    startPrivateChat(socket, payload, (ack) => {
      console.log("Start private chat acknowledgement:", ack);
      // Handle acknowledgement if needed
    });
  };

  const handleSendMessage = () => {
    if (privateChatRoomId && messageInput.trim() !== "") {
      const messageData: MessageDto = {
        content: messageInput,
        chatRoomId: privateChatRoomId,
        // senderId can be omitted if it's managed on the backend
      };

      sendPrivateMessage(socket, messageData, (ack) => {
        console.log("Send private message acknowledgement:", ack);
        // Optionally, add the message to local state
        setPrivateMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: messageInput,
            sender: {
              id: 1, // Replace with actual user ID
              name: "You",
              email: "you@example.com",
              isOnline: true,
              avatar: "",
            }, // Replace with actual user data
            timestamp: new Date().toISOString(),
          },
        ]);
        setMessageInput("");
      });
    }
  };

  // Handle incoming challenges
  useEffect(() => {
    if (socket) {
      const onChallengeReceived = (payload: InitiateChallengeDto) => {
        setIncomingChallenge(payload);
        setIsModalOpen(true);
      };

      socket.on("challengeReceived", onChallengeReceived);

      return () => {
        socket.off("challengeReceived", onChallengeReceived);
      };
    }
  }, [socket]);

  const handleAcceptChallenge = () => {
    if (incomingChallenge) {
      acceptChallenge(
        socket,
        { ...incomingChallenge, accepted: true },
        (ack) => {
          console.log("Challenge accepted acknowledgement:", ack);
          // The backend should emit 'privateChatStarted' upon acceptance
          setIsModalOpen(false);
          setIncomingChallenge(null);
        }
      );
    }
  };

  const handleRejectChallenge = () => {
    if (incomingChallenge) {
      rejectChallenge(
        socket,
        { ...incomingChallenge, accepted: false },
        (ack) => {
          console.log("Challenge rejected acknowledgement:", ack);
          setIsModalOpen(false);
          setIncomingChallenge(null);
        }
      );
    }
  };

  return (
    <div>
      <h2>Private Chat</h2>
      {!socketConnected && <p>Connecting to private chat...</p>}
      {socketConnected && (
        <>
          {!privateChatRoomId ? (
            <button onClick={handleStartChat}>Start Private Chat</button>
          ) : (
            <div>
              <p>Connected to Private Chat Room ID: {privateChatRoomId}</p>
              <div>
                <h3>Messages:</h3>
                <ul>
                  {privateMessages.map((msg) => (
                    <li key={msg.id}>
                      <strong>{msg.sender.name}:</strong> {msg.content}{" "}
                      <em>{msg.timestamp}</em>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Challenge Modal */}
      <ChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challenge={incomingChallenge}
        onAccept={handleAcceptChallenge}
        onReject={handleRejectChallenge}
      />
    </div>
  );
};

export default PrivateChatComponent;
