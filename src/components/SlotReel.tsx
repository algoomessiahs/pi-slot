
import React, { useEffect, useState, useCallback } from "react";
import { SymbolType } from "../types/game";
import { SYMBOLS, getSymbolById } from "../data/symbols";
import { playSoundIfEnabled } from "../utils/soundUtils";

interface SlotReelProps {
  symbols: SymbolType[];
  isSpinning: boolean;
  delay: number;
  highlightPositions?: number[];
}

const SlotReel: React.FC<SlotReelProps> = ({ 
  symbols, 
  isSpinning, 
  delay,
  highlightPositions = [] 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [reelSymbols, setReelSymbols] = useState(symbols);
  const [shouldHighlight, setShouldHighlight] = useState<boolean[]>([false, false, false]);
  
  // Process highlight positions
  useEffect(() => {
    if (highlightPositions.length > 0) {
      const newHighlights = [false, false, false];
      highlightPositions.forEach(pos => {
        if (pos >= 0 && pos < 3) {
          newHighlights[pos] = true;
        }
      });
      setShouldHighlight(newHighlights);
    } else {
      setShouldHighlight([false, false, false]);
    }
  }, [highlightPositions]);
  
  // Start spinning animation with delay
  useEffect(() => {
    if (isSpinning) {
      // Delay the start of animation for each reel
      const startDelay = setTimeout(() => {
        setIsAnimating(true);
        playSoundIfEnabled('spin', 0.3);
      }, delay);
      
      return () => clearTimeout(startDelay);
    }
  }, [isSpinning, delay]);
  
  // Stop spinning animation and set final symbols
  useEffect(() => {
    if (!isSpinning && isAnimating) {
      // Delay the stop of animation for each reel
      const stopDelay = setTimeout(() => {
        setIsAnimating(false);
        setReelSymbols(symbols);
      }, delay + 500); // Add additional delay for stop animation
      
      return () => clearTimeout(stopDelay);
    }
  }, [isSpinning, isAnimating, symbols, delay]);
  
  // Generate random symbols during spinning
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isAnimating) {
      intervalId = setInterval(() => {
        setReelSymbols(prev => {
          // Generate new random symbols during animation
          return prev.map(() => {
            const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
            return SYMBOLS[randomIndex].id;
          });
        });
      }, 100); // Update symbols rapidly during spin
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnimating]);
  
  return (
    <div className="flex flex-col gap-2">
      {reelSymbols.map((symbol, index) => (
        <div 
          key={index} 
          className={`
            slot-container flex items-center justify-center 
            ${isAnimating ? 'animate-slot-spin' : ''} 
            ${shouldHighlight[index] ? 'slot-highlight pulse-highlight' : ''}
          `}
        >
          <div className="p-2 flex items-center justify-center">
            <img 
              src={getSymbolById(symbol).image} 
              alt={getSymbolById(symbol).name}
              className="slot-symbol"
              title={getSymbolById(symbol).name}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotReel;
