
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
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  
  // Preload all symbol images on mount
  useEffect(() => {
    const preloadImages = async () => {
      console.log("Preloading symbol images...");
      
      const loadPromises = SYMBOLS.map((symbol) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = symbol.image;
          img.onload = () => {
            setImagesLoaded(prev => ({ ...prev, [symbol.id]: true }));
            console.log(`Loaded symbol image: ${symbol.id}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load symbol image: ${symbol.id} from ${symbol.image}`);
            resolve();
          };
        });
      });
      
      await Promise.all(loadPromises);
      console.log("All symbol images preloaded");
    };
    
    preloadImages();
  }, []);
  
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
  
  const getSymbolImage = (symbolId: string) => {
    try {
      const symbol = getSymbolById(symbolId);
      return (
        <img 
          src={symbol.image} 
          alt={symbol.name}
          className="slot-symbol"
          title={symbol.name}
          onError={(e) => {
            console.error(`Error loading image for symbol ${symbolId} from ${symbol.image}`);
            e.currentTarget.src = '/assets/images/symbols/default.png'; // Fallback image
          }}
        />
      );
    } catch (error) {
      console.error(`Error getting symbol by id: ${symbolId}`, error);
      return <div className="slot-symbol bg-gray-200 flex items-center justify-center">?</div>;
    }
  };
  
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
            {getSymbolImage(symbol)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotReel;
