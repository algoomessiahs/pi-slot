
import React from "react";
import { Trophy } from "lucide-react";
import { formatNumber } from "../utils/gameLogic";

interface JackpotDisplayProps {
  jackpot: number;
}

const JackpotDisplay: React.FC<JackpotDisplayProps> = ({ jackpot }) => {
  return (
    <div className="jackpot-panel mb-2 relative bg-gradient-to-r from-purple-900/80 to-purple-900/80 backdrop-blur-sm border-2 border-[#FDCC0D] rounded-xl shadow-[0_0_10px_rgba(253,204,13,0.6)] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/images/pi-pattern.png')] opacity-5"></div>
      <div className="relative py-1.5">
        <div className="flex items-center justify-center space-x-2">
          <Trophy size={20} className="text-[#FDCC0D]" />
          <h2 className="text-lg md:text-xl font-bold text-white">JACKPOT</h2>
        </div>
        <div className="jackpot-counter text-center text-xl md:text-2xl py-0.5">π {formatNumber(jackpot)}</div>
      </div>
    </div>
  );
};

export default JackpotDisplay;
