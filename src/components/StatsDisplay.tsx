
import React from "react";
import { formatNumber } from "../utils/gameLogic";

interface StatsDisplayProps {
  balance: number;
  totalBet: number;
  lastWin: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ balance, totalBet, lastWin }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center mb-2">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        <div className="text-xs font-semibold">BALANCE</div>
        <div className="flex items-center justify-center text-sm">
          <span className="pi-coin">π</span>
          <span className="font-bold">{formatNumber(balance)}</span>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        <div className="text-xs font-semibold">TOTAL BET</div>
        <div className="flex items-center justify-center text-sm">
          <span className="pi-coin">π</span>
          <span className="font-bold">{formatNumber(totalBet)}</span>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        <div className="text-xs font-semibold">WIN</div>
        <div className="flex items-center justify-center text-sm">
          <span className="pi-coin">π</span>
          <span className="font-bold">{formatNumber(lastWin)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
