// components/LoginForm.tsx
"use client";

import React from "react";
import useLogin from "./hook/useLogin";

const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full mt-2 p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full mt-2 p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Show loading spinner or message */}
        {loading && <div className="text-center text-gray-300">Loading...</div>}

        {/* Show error message if login fails */}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none"
            disabled={loading}
          >
            Log in
          </button>
        </div>
      </form>
      <p className="text-center text-sm text-gray-400 mt-4">
        Dont have an account?{" "}
        <a href="/auth/register" className="text-gray-300 hover:text-white">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
