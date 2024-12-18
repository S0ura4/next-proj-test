// types.ts
export interface Message {
  id: number;
  content: string;
  sender: User;
  timestamp: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  avatar?: string; // Assuming the `isOnline` field is present, you can adjust this
  // Add any other user properties here as needed
}
