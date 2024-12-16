"use client";

import { getCookie } from "cookies-next";
import { io, Socket } from "socket.io-client";

const baseUrl = "http://localhost:8080";
const cookieToken = getCookie("authToken") as string;

console.log("cookieToken from socket.ts", cookieToken);

export const publicChatSocket = (namespace: string): Socket =>
  io(baseUrl + namespace, {
    transports: ["websocket"],
    auth: {
      token: `Bearer ${cookieToken}`,
    },
  });

export const userStatusSocket = (namespace: string): Socket =>
  io(baseUrl + namespace, {
    transports: ["websocket"],
    auth: {
      token: `Bearer ${cookieToken}`,
    },
  });
