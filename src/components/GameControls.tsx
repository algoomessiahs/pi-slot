
import React from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { Minus, Plus, PlayCircle, Pause, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { playSound } from "../utils/soundUtils";

interface GameControlsProps {
  playSounds?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ playSounds = true }) => {
  const { state, spin, updateBet, updateLines, toggleAutoPlay } = useGame();
  
  // Handlers for bet adjustment
  const decreaseBet = () => {
    updateBet(state.bet - 10);
    if (playSounds) playSound('click');
  };
  
  const increaseBet = () => {
    updateBet(state.bet + 10);
    if (playSounds) playSound('click');
  };
  
  // Handlers for line adjustment
  const decreaseLines = () => {
    updateLines(state.lines - 1);
    if (playSounds) playSound('click');
  };
  
  const increaseLines = () => {
    updateLines(state.lines + 1);
    if (playSounds) playSound('click');
  };
  
  // Handle spin button click
  const handleSpin = () => {
    spin();
    if (playSounds) playSound('spin');
  };
  
  // Show info about paylines
  const showPaylineInfo = () => {
    toast.info(
      "Paylines determine your chances of winning. More paylines = more ways to win, but also costs more per spin.",
      { duration: 5000 }
    );
  };
  
  return (
    <div className="game-controls">
      {/* Control panel */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Paylines controls with info button */}
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
          <div className="flex items-center">
            <span className="font-bold text-sm mr-1">PAYLINES</span>
            <button 
              onClick={showPaylineInfo}
              className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs"
            >
              <HelpCircle size={14} />
            </button>
          </div>
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
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
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
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-5 gap-2">
        {/* Auto play toggle */}
        <button 
          className={`col-span-1 flex items-center justify-center rounded-xl p-3 shadow-sm ${
            state.autoPlay 
              ? 'bg-candy-button-primary text-white' 
              : 'bg-white/30 backdrop-blur-sm'
          }`}
          onClick={() => {
            toggleAutoPlay();
            if (playSounds) playSound('click');
          }}
          disabled={state.isSpinning}
        >
          {state.autoPlay ? (
            <Pause className="mr-1" size={18} />
          ) : (
            <PlayCircle className="mr-1" size={18} />
          )}
          <span className="font-bold text-sm">AUTO</span>
        </button>
        
        {/* Spin button */}
        <button 
          className={`col-span-4 candy-button py-4 text-xl ${state.isSpinning ? 'opacity-70 cursor-not-allowed' : 'animate-pulse'}`}
          onClick={handleSpin}
          disabled={state.isSpinning || state.balance < state.totalBet}
        >
          {state.freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
        </button>
      </div>
    </div>
  );
};

export default GameControls;
