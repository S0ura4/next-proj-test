"use client";

// /app/event/dashboard/layout.tsx

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";
import GroupChat from "./components/GroupChat";
import { UserStatus } from "./components/UserStatus";
import Collapsible from "./components/layout/Collapsible";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // To navigate after logout

  // Logout function
  const handleLogout = () => {
    // Remove all relevant cookies (authToken, userId, etc.)
    deleteCookie("authToken");
    deleteCookie("userId");
    deleteCookie("userName");
    deleteCookie("userEmail");

    // Redirect to the login page
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-800 h-screen">
      {/* Left Section: Collapsible (Sidebar) */}
      <div className="flex-1 lg:w-1/4 w-full bg-gray-900 p-6">
        <Collapsible /> {/* This will contain your game play logic */}
      </div>

      {/* Center Section: Public Chat (Main Content) */}
      <div className="bg-gray-900 p-6 flex flex-col h-[95vh] overflow-hidden">
        <GroupChat /> {/* Add your GroupChat component here */}
        <ScrollArea className="flex-1">{children}</ScrollArea>{" "}
        {/* Children will render here */}
      </div>

      {/* Right Section: Users Online and Logout */}
      <div className="lg:w-1/4 w-full bg-gray-900 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Users Online</h2>
        <UserStatus /> {/* User Status component */}
        {/* Logout Button */}
        <Button
          variant="outline"
          className="mt-6 w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardLayout;
