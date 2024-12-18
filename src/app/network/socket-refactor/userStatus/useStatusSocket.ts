import { StatusSpace } from "@/app/core/constants/namespace.constants";
import {
  socketEvents,
  userStatusEvents,
} from "@/app/core/constants/socket.events";
import { User } from "@/app/event/dashboard/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { userStatusSocket } from "../socket";

export let statusSocketConnection: Socket;

export default function useUserStatusSocket(
  setUsers: Dispatch<SetStateAction<User[]>>
  //onRequestResponse?: (data: unknown) => void
) {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    statusSocketConnection = userStatusSocket(StatusSpace.userStatus);

    statusSocketConnection.on(socketEvents.connect, () => {
      setSocketConnected(true);
      console.log("Status Socket connected.");
    });

    statusSocketConnection.on(socketEvents.connectError, (error) => {
      setSocketConnected(false);
      console.error("Status Socket connection error:", error);
    });

    statusSocketConnection.on(socketEvents.reconnectAttempt, (attempt) => {
      console.log(`Reconnecting... Attempt #${attempt}`);
    });

    statusSocketConnection.on(socketEvents.reconnect, () => {
      console.log("Reconnected successfully.");
    });

    statusSocketConnection.on(userStatusEvents.userOnline, (userId: number) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isOnline: true } : user
        )
      );
    });

    statusSocketConnection.on(
      userStatusEvents.userOffline,
      (userId: number) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isOnline: false } : user
          )
        );
      }
    );

    //statusSocketConnection.on(
    //  privateChatEvents.requestResponse,
    //  (data: unknown) => {
    //    console.log("Received request response:", data);
    //    if (onRequestResponse) onRequestResponse(data);
    //  }
    //);

    return () => {
      console.log("Cleaning up socket connection...");
      statusSocketConnection.disconnect();
    };
  }, [setUsers]);
  return { statusSocketConnection, socketConnected };
}
