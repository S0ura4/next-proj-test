import { privateChatEvents } from "@/app/core/constants/socket.events";
import { privateChatSocketConnection } from "./usePrivateChatListeners";

export function startPrivateChat(payload: { receiver: number }) {
  if (privateChatSocketConnection?.connected) {
    privateChatSocketConnection.emit(
      privateChatEvents.startPrivateChat,
      payload,
      (ack: string) => {
        console.log("Start private chat ack:", ack);
      }
    );
  }
}

export function joinPrivateChat(roomId: number) {
  if (privateChatSocketConnection?.connected) {
    privateChatSocketConnection.emit(
      privateChatEvents.joinPrivateChat,
      { roomId },
      (ack: string) => {
        console.log("Join private chat ack:", ack);
      }
    );
  }
}

export function sendPrivateMessage(messageData: {
  chatRoomId: number;
  content: string;
}) {
  if (privateChatSocketConnection?.connected) {
    privateChatSocketConnection.emit(
      privateChatEvents.sendMessage,
      messageData,
      (ack: string) => {
        console.log("Private message sent ack:", ack);
      }
    );
  }
}

// handeling challange section
export function sendAlertRequest(payload: {
  playerTwoId: number;
  accepted: boolean;
}) {
  if (privateChatSocketConnection?.connected) {
    privateChatSocketConnection.emit(
      privateChatEvents.alertRequest,
      payload,
      (ack: string) => {
        console.log("Alert request ack:", ack);
      }
    );
  }
}

export function sendChallengeResponse(payload: {
  playerOneId: number;
  playerTwoId: number;
  accepted: boolean;
}) {
  if (privateChatSocketConnection?.connected) {
    privateChatSocketConnection.emit(
      "alert_Response",
      payload,
      (ack: string) => {
        console.log("Challenge response ack:", ack);
      }
    );
  } else {
    console.warn("Socket not connected");
  }
}
