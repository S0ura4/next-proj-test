// ChallengeModal.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { InitiateChallengeDto } from "../types";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: InitiateChallengeDto | null;
  onAccept: () => void;
  onReject: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  challenge,
  onAccept,
  onReject,
}) => {
  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold">New Challenge Received</h3>
        <p>
          User ID {challenge.playerOneId} has challenged you to a game. Do you
          accept?
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="ghost" onClick={onReject}>
            Reject
          </Button>
          <Button onClick={onAccept}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
