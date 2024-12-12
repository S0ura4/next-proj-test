// types.ts
export interface Message {
  id: number;
  content: string;
  sender: User;
  timestamp: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  isOnline: boolean;
  avatar?: string; // Assuming the `isOnline` field is present, you can adjust this
  // Add any other user properties here as needed
}

// Chat Room Data Transfer Object
export interface ChatRoomDto {
  id?: number;
  name?: string;
  receiver?: number; // Corrected spelling from 'reciever' to 'receiver'
}

// Message Data Transfer Object
export interface MessageDto {
  content: string;
  senderId?: number;
  chatRoomId?: number;
}

// Initiate Challenge Data Transfer Object
export interface InitiateChallengeDto {
  playerOneId: number;
  playerTwoId: number;
  accepted: boolean;
}
