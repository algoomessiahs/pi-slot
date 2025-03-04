
import React from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { Minus, Plus, PlayCircle, Pause } from "lucide-react";

const GameControls: React.FC = () => {
  const { state, spin, updateBet, updateLines, toggleAutoPlay } = useGame();
  
  // Handlers for bet adjustment
  const decreaseBet = () => updateBet(state.bet - 10);
  const increaseBet = () => updateBet(state.bet + 10);
  
  // Handlers for line adjustment
  const decreaseLines = () => updateLines(state.lines - 1);
  const increaseLines = () => updateLines(state.lines + 1);
  
  return (
    <div className="game-controls">
      {/* Line controls */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="col-span-2 flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
          <span className="font-bold text-sm">LINES</span>
          <div className="flex items-center">
            <button 
              className="control-button" 
              onClick={decreaseLines}
              disabled={state.lines <= 1 || state.isSpinning}
            >
              <Minus size={16} />
            </button>
            <span className="mx-3 font-bold">{state.lines}</span>
            <button 
              className="control-button" 
              onClick={increaseLines}
              disabled={state.lines >= 20 || state.isSpinning}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        {/* Bet controls */}
        <div className="col-span-2 flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
          <span className="font-bold text-sm">BET</span>
          <div className="flex items-center">
            <button 
              className="control-button" 
              onClick={decreaseBet}
              disabled={state.bet <= 10 || state.isSpinning}
            >
              <Minus size={16} />
            </button>
            <div className="mx-3 flex items-center">
              <span className="pi-coin">π</span>
              <span className="font-bold">{state.bet}</span>
            </div>
            <button 
              className="control-button" 
              onClick={increaseBet}
              disabled={state.bet >= 500 || state.isSpinning}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        {/* Auto play toggle */}
        <button 
          className={`flex items-center justify-center rounded-xl p-3 shadow-sm ${
            state.autoPlay 
              ? 'bg-candy-button-primary text-white' 
              : 'bg-white/30 backdrop-blur-sm'
          }`}
          onClick={toggleAutoPlay}
          disabled={state.isSpinning}
        >
          {state.autoPlay ? (
            <Pause className="mr-1" size={18} />
          ) : (
            <PlayCircle className="mr-1" size={18} />
          )}
          <span className="font-bold text-sm">AUTO</span>
        </button>
      </div>
      
      {/* Spin button */}
      <button 
        className={`candy-button w-full py-4 text-xl ${state.isSpinning ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={spin}
        disabled={state.isSpinning || state.balance < state.totalBet}
      >
        {state.freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
      </button>
    </div>
  );
};

export default GameControls;
