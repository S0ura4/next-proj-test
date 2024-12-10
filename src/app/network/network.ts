import axios from "axios";
import { getCookie } from "cookies-next"; // Import getCookie to retrieve the token

// Base URL for your backend, this can be set in .env.local
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Create an Axios instance
const httpClient = axios.create({
  baseURL: baseURL, // API base URL
  headers: {
    "Content-Type": "application/json", // Set the content type for requests
  },
});

// Request Interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = getCookie("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional, for handling responses or errors)
httpClient.interceptors.response.use(
  (response) => {
    return response; // Return the response data
  },
  (error) => {
    // Handle errors globally here (like showing a global error message)
    console.error("API Error: ", error);
    return Promise.reject(error); // Return the error
  }
);

export default httpClient;
