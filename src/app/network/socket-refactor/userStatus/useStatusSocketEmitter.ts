//import { privateChatEvents } from "@/app/core/constants/socket.events";
//import { statusSocketConnection } from "./useStatusSocket";

//export function sendAlertRequest(payload: {
//  playerTwoId: number;
//  accepted: boolean;
//}) {
//  if (statusSocketConnection?.connected) {
//    statusSocketConnection.emit(
//      privateChatEvents.alertRequest,
//      payload,
//      (ack: string) => {
//        console.log("Alert request ack:", ack);
//      }
//    );
//  }
//}

//export function sendChallengeResponse(payload: {
//  playerOneId: number;
//  playerTwoId: number;
//  accepted: boolean;
//}) {
//  if (statusSocketConnection?.connected) {
//    statusSocketConnection.emit("alert_Response", payload, (ack: string) => {
//      console.log("Challenge response ack:", ack);
//    });
//  } else {
//    console.warn("Socket not connected");
//  }
//}
