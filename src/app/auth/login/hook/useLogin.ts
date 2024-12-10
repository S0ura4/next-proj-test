// hooks/useLogin.ts
import { useState } from "react";
import { setCookie, getCookie } from "cookies-next";
import httpClient from "@/app/network/network";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post("/auth/users/signin", {
        email,
        password,
      });

      // Save the token in a cookie
      const { accessToken, user } = response.data.data;
      setCookie("authToken", accessToken, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
        sameSite: "strict",
      });

      // Save user data in cookies (or localStorage if preferred)
      setCookie("userId", user.id, { maxAge: 7 * 24 * 60 * 60, path: "/" });
      setCookie("userName", user.name, { maxAge: 7 * 24 * 60 * 60, path: "/" });
      setCookie("userEmail", user.email, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      console.log("Login successful:", response.data);

      // Redirect after successful login
      if (getCookie("authToken") !== undefined) {
        window.location.href = "/event/dashboard";
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
};

export default useLogin;
