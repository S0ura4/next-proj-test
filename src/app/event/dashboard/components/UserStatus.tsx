"use client";

import React from "react";
import useUserStatus from "../hooks/useUserStatus";
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

export function UserStatus() {
  const { users, error } = useUserStatus();
  const userId = getCookie("userId") as string;
  if (error) {
    return <div className="text-destructive text-sm">Error: {error}</div>;
  }

  const handleSendChallenge = (user: User) => {
    console.log(`sender ${userId} ,reciever ${user.id}`);
    // Implement your challenge sending logic here
  };

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="space-y-1">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user: User) => (
            <div key={user.id} className="flex items-center">
              {user.isOnline ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1 h-auto"
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
                    <DropdownMenuItem onClick={() => handleSendChallenge(user)}>
                      <Send className="mr-2 h-4 w-4" />
                      <span>Send Challenge</span>
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
        )}
      </div>
    </ScrollArea>
  );
}
