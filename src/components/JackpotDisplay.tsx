
import React from "react";
import { Trophy } from "lucide-react";
import { formatNumber } from "../utils/gameLogic";

interface JackpotDisplayProps {
  jackpot: number;
  isActive?: boolean;
}

const JackpotDisplay: React.FC<JackpotDisplayProps> = ({ jackpot, isActive = false }) => {
  return (
    <div className={`jackpot-panel mb-2 relative bg-gradient-to-r from-purple-900/80 to-purple-900/80 backdrop-blur-sm border-2 ${isActive ? 'border-[#FDCC0D] animate-jackpot-pulse' : 'border-purple-400'} rounded-xl shadow-${isActive ? '[0_0_15px_rgba(253,204,13,0.8)]' : 'md'} overflow-hidden transition-all duration-500`}>
      <div className="absolute inset-0 bg-[url('/assets/images/pi-pattern.png')] opacity-5"></div>
      <div className="relative py-1.5">
        <div className="flex items-center justify-center space-x-2">
          <Trophy size={20} className={`${isActive ? 'text-[#FDCC0D]' : 'text-purple-200'}`} />
          <h2 className="text-lg md:text-xl font-bold text-white">JACKPOT</h2>
          {isActive && (
            <span className="animate-pulse text-xs bg-amber-300 text-amber-800 px-1 py-0.5 rounded-sm font-bold">
              ACTIVE
            </span>
          )}
        </div>
        <div className={`jackpot-counter text-center text-xl md:text-2xl py-0.5 ${isActive ? 'text-amber-300' : 'text-white'}`}>
          π {formatNumber(jackpot)}
        </div>
      </div>
    </div>
  );
};

export default JackpotDisplay;
