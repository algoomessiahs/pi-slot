
import React, { useEffect, useState } from "react";
import { formatNumber } from "../utils/gameLogic";
import { playSoundIfEnabled, stopSound } from "../utils/soundUtils";
import confetti from "canvas-confetti";

interface WinDisplayProps {
  winAmount: number;
}

const WinDisplay: React.FC<WinDisplayProps> = ({ winAmount }) => {
  const [showCoins, setShowCoins] = useState(false);
  const [coins, setCoins] = useState<{ id: number; left: string; delay: string }[]>([]);
  
  // Generate coins effect
  useEffect(() => {
    if (winAmount > 0) {
      // Play win sound based on amount
      if (winAmount >= 10000) {
        playSoundIfEnabled('jackpot', 1.0);
        
        // Trigger confetti for huge wins
        const duration = 5 * 1000;
        const end = Date.now() + duration;
        
        const frame = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#9b87f5', '#7E69AB', '#FFDB58']
          });
          
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#9b87f5', '#7E69AB', '#FFDB58']
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        
        frame();
      } else if (winAmount >= 5000) {
        playSoundIfEnabled('bigWin', 0.8);
      } else {
        playSoundIfEnabled('win', 0.6);
      }
      
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
        
        return () => {
          clearTimeout(timer);
          // Stop sounds when component unmounts
          stopSound('win');
          stopSound('bigWin');
          stopSound('jackpot');
        };
      }
    }
    
    // Clean up sounds if component unmounts
    return () => {
      stopSound('win');
      stopSound('bigWin');
      stopSound('jackpot');
    };
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
        ${isHugeWin ? 'border-[#FDCC0D]' : 'border-[#9b87f5]'}
        animate-bounce-in
      `}>
        <div className="text-xl font-bold mb-1">
          {isHugeWin ? 'MEGA WIN!' : isBigWin ? 'BIG WIN!' : 'YOU WON!'}
        </div>
        <div className="flex items-center justify-center text-3xl font-bold">
          <span className="pi-coin text-2xl">π</span>
          <span className={`
            ${isHugeWin ? 'text-4xl text-[#FDCC0D]' : isBigWin ? 'text-3xl text-[#9b87f5]' : ''}
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
                color: Math.random() > 0.5 ? '#FDCC0D' : '#9b87f5'
              }}
            >
              π
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WinDisplay;
