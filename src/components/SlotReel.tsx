
import React, { useEffect, useState, useRef } from "react";
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
  const [spinSpeed, setSpinSpeed] = useState(100);
  const [isBlurred, setIsBlurred] = useState(false);
  const reelRef = useRef<HTMLDivElement>(null);
  
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
        setSpinSpeed(100); // Reset to fast speed
        setIsBlurred(true);
        playSoundIfEnabled('spin', 0.3);
      }, delay);
      
      return () => clearTimeout(startDelay);
    }
  }, [isSpinning, delay]);
  
  // Stop spinning animation and set final symbols
  useEffect(() => {
    if (!isSpinning && isAnimating) {
      // Gradually slow down before stopping
      const slowDownInterval = setInterval(() => {
        setSpinSpeed(prev => {
          const newSpeed = prev + 20;
          if (newSpeed > 200) {
            clearInterval(slowDownInterval);
            
            // Stop after slowing down
            setTimeout(() => {
              setIsAnimating(false);
              setIsBlurred(false);
              setReelSymbols(symbols);
            }, 200);
          }
          return newSpeed;
        });
      }, 100);
      
      return () => {
        clearInterval(slowDownInterval);
      };
    }
  }, [isSpinning, isAnimating, symbols]);
  
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
      }, spinSpeed); // Use dynamic speed value
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnimating, spinSpeed]);
  
  const getSymbolImage = (symbolId: string) => {
    try {
      const symbol = getSymbolById(symbolId);
      
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={symbol.image} 
            alt={symbol.name}
            className={`max-w-full max-h-full object-contain p-2 ${isBlurred ? 'slot-blur' : ''}`}
            title={symbol.name}
            onError={(e) => {
              console.error(`Error loading image for symbol ${symbolId} from ${symbol.image}`);
              e.currentTarget.src = '/assets/images/symbols/pi-symbol.png'; // Fallback image
            }}
          />
        </div>
      );
    } catch (error) {
      console.error(`Error getting symbol by id: ${symbolId}`, error);
      return <div className="slot-symbol bg-gray-200 flex items-center justify-center">?</div>;
    }
  };
  
  return (
    <div className="flex flex-col gap-2" ref={reelRef}>
      {reelSymbols.map((symbol, index) => (
        <div 
          key={index} 
          className={`
            slot-container flex items-center justify-center 
            ${isAnimating ? 'animate-slot-spin' : ''} 
            ${!isSpinning && !isAnimating && shouldHighlight[index] ? 'slot-highlight pulse-highlight' : ''}
          `}
        >
          {getSymbolImage(symbol)}
        </div>
      ))}
    </div>
  );
};

export default SlotReel;
