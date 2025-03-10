
import React from "react";

interface FreeSpinsIndicatorProps {
  freeSpinsRemaining: number;
}

const FreeSpinsIndicator: React.FC<FreeSpinsIndicatorProps> = ({ freeSpinsRemaining }) => {
  if (freeSpinsRemaining <= 0) return null;
  
  return (
    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full text-white font-bold shadow-lg animate-pulse text-sm">
      Free Spins: {freeSpinsRemaining}
    </div>
  );
};

export default FreeSpinsIndicator;
