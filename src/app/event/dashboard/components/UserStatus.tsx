"use client";

import React from "react";
import useUserStatus from "../hooks/useUserStatus";
import { User } from "../types";
import { UserCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserStatus() {
  const { users, error } = useUserStatus();

  if (error) {
    return <div className="text-destructive text-sm">Error: {error}</div>;
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user: User) => (
            <div key={user.id} className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <UserCircle className="h-6 w-6" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.email || "No email"}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <div
                  className={`h-2 w-2 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No users available</p>
        )}
      </div>
    </ScrollArea>
  );
}
