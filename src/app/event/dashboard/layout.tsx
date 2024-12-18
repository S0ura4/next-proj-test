"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import GroupChat from "./components/GroupChat";
import { UserStatus } from "./components/UserStatus";
import Collapsible from "./components/layout/Collapsible";
import useUserStatusSocket from "@/app/network/socket-refactor/userStatus/useStatusSocket";
import ChallengePopup from "./components/private/ChallangePopup";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isGameplayOpen, setIsGameplayOpen] = useState(false);

  const [challengeData, setChallengeData] = useState<any | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const handleLogout = () => {
    deleteCookie("authToken");
    deleteCookie("userId");
    deleteCookie("userName");
    deleteCookie("userEmail");
    router.push("/auth/login");
  };

  // Callback whenever a requestResponse event is received
  const onRequestResponse = (data: unknown) => {
    // data structure expected: { from: string, message: { playerOneId, playerTwoId, accepted } }
    setChallengeData(data);
    setShowChallengeModal(true);
  };

  // Initialize user status socket with callback
  useUserStatusSocket(() => {}, onRequestResponse);

  return (
    <div className="h-screen bg-gray-800">
      {isGameplayOpen ? (
        <Collapsible isOpen={isGameplayOpen} setIsOpen={setIsGameplayOpen} />
      ) : (
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Section: Collapsible (Sidebar) */}
          <div className="flex-1 lg:w-1/4 w-full bg-gray-900 p-6">
            <button
              onClick={() => setIsGameplayOpen(true)}
              className="text-white p-2 bg-gray-600 rounded-md w-full"
            >
              Maximize
            </button>
          </div>

          {/* Center Section: Public Chat (Main Content) */}
          <div className="bg-gray-900 p-6 flex flex-col h-full overflow-hidden flex-1">
            <GroupChat />
            <ScrollArea className="flex-1">{children}</ScrollArea>
          </div>

          {/* Right Section: Users Online and Logout */}
          <div className="lg:w-1/4 w-full bg-gray-900 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Users Online
            </h2>
            <UserStatus />
            <Button
              variant="outline"
              className="mt-6 w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      )}

      {showChallengeModal && challengeData && (
        <ChallengePopup
          from={challengeData.from}
          payload={challengeData.message}
          onClose={() => setShowChallengeModal(false)}
        />
      )}
    </div>
  );
}
