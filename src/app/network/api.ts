// api.ts
import httpClient from "./network"; // Import the httpClient instance

export const fetchMessages = async () => {
  try {
    const response = await httpClient.get("/chat/messages/public-messages");
    return response.data.data; // Return the messages
  } catch (error) {
    console.error("Error fetching public messages:", error);
    throw error; // Rethrow the error to be handled elsewhere
  }
};
