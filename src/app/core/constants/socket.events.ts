export const socketEvents = {
  connect: "connect",
  disconnect: "disconnect",
  connectError: "connect_error",
  reconnectAttempt: "reconnect_attempt",
  reconnect: "reconnect",
};

export const userStatusEvents = {
  userOnline: "userOnline",
  userOffline: "userOffline",
};

export const publicChatEvents = {
  publicChatStarted: "publicChatStarted",
  receivePublicMessage: "receivePublicMessage",
  startPublicChat: "startPublicChat",
  joinPublicChat: "joinPublicChat",
  sendPublicMessage: "sendPublicMessage",
};
