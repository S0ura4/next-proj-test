"use client";

import React, { useState } from "react";
import { User } from "../types";
import { UserCircle, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookie } from "cookies-next";
import useUserStatusSocket from "@/app/network/socket-refactor/userStatus/useStatusSocket";
import useUserStatus from "../hooks/useUserStatus";
//import { sendAlertRequest } from "@/app/network/socket-refactor/privateChat/usePrivateChatEmitters";

export function UserStatus() {
  const { users, setUsers, error } = useUserStatus();
  const { socketConnected } = useUserStatusSocket(setUsers);
  const userId = getCookie("userId") as string;

  const [challengeSent, setChallengeSent] = useState<{
    [key: number]: boolean;
  }>({});

  const handleSendChallenge = (user: User) => {
    if (challengeSent[user.id]) {
      alert("Challenge already sent to this user.");
      return;
    }
    console.log(`sender ${userId}, receiver ${user.id}`);
    //sendAlertRequest({ playerTwoId: user.id, accepted: false });
    setChallengeSent((prev) => ({ ...prev, [user.id]: true }));
    alert(`Challenge sent to ${user.name}`);
  };

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="space-y-1">
        {!error && socketConnected ? (
          Array.isArray(users) && users.length > 0 ? (
            users.map((user: User) => (
              <div key={user.id} className="flex items-center">
                {user.isOnline ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 py-1 h-auto"
                        disabled={!socketConnected}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <UserCircle className="h-5 w-5" />
                          </div>
                          <div className="ml-2 flex-grow text-left">
                            <p className="text-sm font-medium leading-none">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email || "No email"}
                            </p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleSendChallenge(user)}
                        disabled={challengeSent[user.id]}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        <span>
                          {challengeSent[user.id]
                            ? "Challenge Sent"
                            : "Send Challenge"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="w-full px-2 py-1 opacity-50">
                    <div className="flex items-center w-full">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <UserCircle className="h-5 w-5" />
                      </div>
                      <div className="ml-2 flex-grow text-left">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email || "No email"}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground p-2">
              No users available
            </p>
          )
        ) : error ? (
          <p className="text-sm text-red-500 p-2">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground p-2">
            Connecting to the user status server...
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
