import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { User } from "../types";
import { useSocketStatus } from "@/app/network/userStatus-socket";

const useUserStatus = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie("authToken") as string;
  const userId = getCookie("userId") as string;

  const { socket, socketConnected } = useSocketStatus(setUsers);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        if (!token) {
          setError("Authorization token not found");
          return;
        }

        const response = await axios.post(
          "http://localhost:8080/api/users/private/all",
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const usersData: User[] = response.data?.data?.data || [];
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching user status:", err);
        setError("Error fetching user status.");
      }
    };

    fetchUserStatus();
  }, [token, userId]);

  if (socket && socketConnected) {
    socket.emit("sendMessage", { text: "socket connected!" });
  }

  return { users, error, setUsers };
};

export default useUserStatus;