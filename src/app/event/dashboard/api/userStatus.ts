import httpClient from "@/app/network/network";

export const fetchUserStatus = async () => {
  try {
    const response = await httpClient.get("/api/users/status"); // Adjust path as needed
    return response.data;
  } catch (err) {
    console.error("Error fetching user status:", err);
    throw err;
  }
};
