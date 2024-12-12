// privateRequest.ts

import { Socket } from "socket.io-client";
import { ChatRoomDto, MessageDto, InitiateChallengeDto } from "../types";

// Function to start a private chat
export const startPrivateChat = (
  socket: Socket | null,
  payload: ChatRoomDto,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("startPrivateChat", payload, (ack: string) => {
      console.log("Private chat started:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};

// Function to join a private chat room
export const joinPrivateChat = (
  socket: Socket | null,
  roomId: number,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("joinPrivateChat", { roomId }, (ack: string) => {
      console.log("Joined private chat:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};

// Function to send a private message
export const sendPrivateMessage = (
  socket: Socket | null,
  messageData: MessageDto,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("sendMessage", messageData, (ack: string) => {
      console.log("Private message sent:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};

// Function to initiate a connection (challenge)
export const initiatePrivateConnection = (
  socket: Socket | null,
  payload: InitiateChallengeDto,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("initiateConnection", payload, (ack: string) => {
      console.log("Challenge sent acknowledgement:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};

// Function to accept a challenge
export const acceptChallenge = (
  socket: Socket | null,
  payload: InitiateChallengeDto,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("acceptChallenge", payload, (ack: string) => {
      console.log("Challenge acceptance acknowledgement:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};

// Function to reject a challenge
export const rejectChallenge = (
  socket: Socket | null,
  payload: InitiateChallengeDto,
  onAcknowledgement: (ack: string) => void
) => {
  if (socket) {
    socket.emit("rejectChallenge", payload, (ack: string) => {
      console.log("Challenge rejection acknowledgement:", ack);
      onAcknowledgement(ack);
    });
  } else {
    console.error("Socket is not connected.");
  }
};
