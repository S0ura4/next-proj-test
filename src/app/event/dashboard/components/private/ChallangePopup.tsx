import { sendChallengeResponse } from "@/app/network/socket-refactor/privateChat/usePrivateChatEmitters";
import React from "react";

interface ChallengePopupProps {
  from: string;
  payload: { playerOneId: number; playerTwoId: number; accepted: boolean };
  onClose: () => void;
}

const ChallengePopup: React.FC<ChallengePopupProps> = ({
  from,
  payload,
  onClose,
}) => {
  const handleAccept = () => {
    sendChallengeResponse({ ...payload, accepted: true });
    onClose();
  };

  const handleReject = () => {
    sendChallengeResponse({ ...payload, accepted: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-black">
        <h2 className="text-xl font-semibold mb-4">
          {from} is challenging you!
        </h2>
        <p className="mb-4">Do you want to accept the challenge?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengePopup;
