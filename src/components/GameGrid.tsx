
import React from "react";
import SlotReel from "./SlotReel";
import { SymbolType } from "../types/game";

interface GameGridProps {
  displayGrid: SymbolType[][];
  isSpinning: boolean;
  highlightedPositions: {[key: number]: number[]};
}

const GameGrid: React.FC<GameGridProps> = ({ displayGrid, isSpinning, highlightedPositions }) => {
  return (
    <div className="game-grid grid grid-cols-3 gap-2 mb-2 overflow-hidden rounded-xl bg-gradient-to-b from-transparent to-white/20 backdrop-blur-sm p-2 border border-white/30">
      {Array(3).fill(null).map((_, colIndex) => (
        <SlotReel 
          key={colIndex} 
          symbols={displayGrid.map(row => row[colIndex])} 
          isSpinning={isSpinning} 
          delay={colIndex * 200}
          highlightPositions={highlightedPositions[colIndex] || []}
        />
      ))}
    </div>
  );
};

export default GameGrid;
