
import React, { useEffect, useState } from "react";
import { formatNumber } from "../utils/gameLogic";

interface WinDisplayProps {
  winAmount: number;
}

const WinDisplay: React.FC<WinDisplayProps> = ({ winAmount }) => {
  const [showCoins, setShowCoins] = useState(false);
  const [coins, setCoins] = useState<{ id: number; left: string; delay: string }[]>([]);
  
  // Generate coins effect
  useEffect(() => {
    if (winAmount > 0) {
      // Only show coins for significant wins
      if (winAmount >= 1000) {
        setShowCoins(true);
        
        // Generate random coins
        const newCoins = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.5}s`
        }));
        
        setCoins(newCoins);
        
        // Remove coins after animation
        const timer = setTimeout(() => {
          setShowCoins(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [winAmount]);
  
  if (winAmount <= 0) return null;
  
  // Determine size and animation based on win amount
  const isHugeWin = winAmount >= 10000;
  const isBigWin = winAmount >= 5000 && winAmount < 10000;
  const isGoodWin = winAmount >= 1000 && winAmount < 5000;
  
  return (
    <div className="win-display absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className={`
        ${isHugeWin ? 'win-animation scale-125' : ''}
        ${isBigWin ? 'win-animation scale-110' : ''}
        ${isGoodWin ? 'scale-105' : ''}
        bg-white/80 backdrop-blur-md rounded-3xl px-8 py-6 shadow-xl border-4 
        ${isHugeWin ? 'border-donut-gold' : 'border-candy-button-primary'}
        animate-bounce-in
      `}>
        <div className="text-xl font-bold mb-1">
          {isHugeWin ? 'MEGA WIN!' : isBigWin ? 'BIG WIN!' : 'YOU WON!'}
        </div>
        <div className="flex items-center justify-center text-3xl font-bold">
          <span className="pi-coin text-2xl">π</span>
          <span className={`
            ${isHugeWin ? 'text-4xl text-donut-gold' : isBigWin ? 'text-3xl text-donut-red' : ''}
          `}>
            {formatNumber(winAmount)}
          </span>
        </div>
      </div>
      
      {/* Coin animation */}
      {showCoins && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="absolute top-0 text-2xl animate-coins-rain"
              style={{ 
                left: coin.left, 
                animationDelay: coin.delay,
                color: Math.random() > 0.5 ? '#FDCC0D' : '#FFD700'
              }}
            >
              🪙
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WinDisplay;
