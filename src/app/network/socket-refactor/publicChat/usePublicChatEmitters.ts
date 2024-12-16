import { publicChatEvents } from "@/app/core/constants/socket.events";
import { publicChatSocketConnection } from "./usePublicChatListeners";

export function startPublicChat() {
  if (publicChatSocketConnection?.connected) {
    publicChatSocketConnection.emit(
      publicChatEvents.startPublicChat,
      (ack: string) => {
        console.log("Public chat started:", ack);
      }
    );
  }
}

export function joinPublicChat() {
  if (publicChatSocketConnection?.connected) {
    publicChatSocketConnection.emit(
      publicChatEvents.joinPublicChat,
      (ack: string) => {
        console.log("Joined public chat:", ack);
      }
    );
  }
}

export function sendMessagePublicChat(messageData: {
  content: string;
  chatRoomId: number;
}) {
  if (publicChatSocketConnection?.connected) {
    publicChatSocketConnection.emit(
      publicChatEvents.sendPublicMessage,
      messageData,
      (ack: string) => {
        console.log("Message sent:", ack);
      }
    );
  }
}
