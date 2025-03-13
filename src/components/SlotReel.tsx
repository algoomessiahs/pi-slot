
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
  const [reelSymbols, setReelSymbols] = useState<SymbolType[]>([]);
  const [shouldHighlight, setShouldHighlight] = useState<boolean[]>([false, false, false]);
  const [spinSpeed, setSpinSpeed] = useState(100);
  const [isBlurred, setIsBlurred] = useState(false);
  const [spinTransition, setSpinTransition] = useState("none");
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  
  // Initialize with random symbols instead of all the same
  useEffect(() => {
    const randomSymbols = Array(3).fill(null).map(() => {
      const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
      return SYMBOLS[randomIndex].id;
    });
    setReelSymbols(randomSymbols);
  }, []);
  
  // When symbols prop changes and not spinning, update displayed symbols
  useEffect(() => {
    if (!isSpinning && !isAnimating) {
      setReelSymbols(symbols);
    }
  }, [symbols, isSpinning, isAnimating]);
  
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
  
  // Create and manage spin sound
  useEffect(() => {
    // Create audio element for spin sound
    const audio = new Audio('/assets/sounds/spin.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    spinSoundRef.current = audio;
    
    return () => {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current = null;
      }
    };
  }, []);
  
  // Start spinning animation with delay
  useEffect(() => {
    if (isSpinning) {
      // Delay the start of animation for each reel
      const startDelay = setTimeout(() => {
        setIsAnimating(true);
        setSpinSpeed(80); // Start with faster speed
        setIsBlurred(true);
        setSpinTransition("all 0.1s ease-in"); // Smooth transition when starting
        
        // Play spin sound (only for the first reel to avoid overlapping)
        if (delay === 0 && spinSoundRef.current) {
          spinSoundRef.current.currentTime = 0;
          spinSoundRef.current.play().catch(e => console.error("Error playing spin sound:", e));
        }
      }, delay);
      
      return () => clearTimeout(startDelay);
    } else {
      // Stop spin sound when spinning stops
      if (delay === 0 && spinSoundRef.current) {
        spinSoundRef.current.pause();
      }
    }
  }, [isSpinning, delay]);
  
  // Stop spinning animation and set final symbols with smooth transition
  useEffect(() => {
    if (!isSpinning && isAnimating) {
      // Gradually slow down before stopping
      const slowDownInterval = setInterval(() => {
        setSpinSpeed(prev => {
          const newSpeed = prev + 40;
          
          // Update transition to be smoother as it slows down
          if (newSpeed > 200) {
            setSpinTransition("all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"); // Bouncy effect when stopping
            
            // Prepare for final stop with easing
            setTimeout(() => {
              setIsAnimating(false);
              setIsBlurred(false);
              setReelSymbols(symbols);
              
              // Reset transition after stopping
              setTimeout(() => {
                setSpinTransition("none");
              }, 300);
            }, 300);
            
            clearInterval(slowDownInterval);
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
            className={`max-w-full max-h-full object-contain p-2 ${isBlurred ? 'slot-blur' : ''} transition-all duration-200`}
            title={symbol.name}
            style={{ transition: spinTransition }}
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
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transition: spinTransition 
          }}
        >
          {getSymbolImage(symbol)}
        </div>
      ))}
    </div>
  );
};

export default SlotReel;
