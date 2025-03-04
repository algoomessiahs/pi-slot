
import React from "react";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { Minus, Plus, PlayCircle, Pause, HelpCircle } from "lucide-react";
import { playSoundIfEnabled } from "../utils/soundUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GameControlsProps {
  onOpenPayTable: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onOpenPayTable }) => {
  const { state, spin, updateBet, updateLines, toggleAutoPlay } = useGame();
  
  // Handlers for bet adjustment
  const decreaseBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(state.bet - 10);
  };
  
  const increaseBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(state.bet + 10);
  };
  
  // Set min/max bet
  const setMinBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(10);
  };
  
  const setMaxBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(500);
  };
  
  // Handlers for line adjustment
  const decreaseLines = () => {
    playSoundIfEnabled('buttonClick');
    updateLines(state.lines - 1);
  };
  
  const increaseLines = () => {
    playSoundIfEnabled('buttonClick');
    updateLines(state.lines + 1);
  };
  
  // Handle spin button
  const handleSpin = () => {
    if (!state.isSpinning && state.balance >= state.totalBet) {
      playSoundIfEnabled('buttonClick');
      spin();
    }
  };
  
  return (
    <div className="game-controls">
      {/* Line controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1 flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
          <div className="flex items-center">
            <span className="font-bold text-sm mr-2">PAYLINES</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      playSoundIfEnabled('buttonClick');
                      onOpenPayTable();
                    }}
                  >
                    <HelpCircle size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">More paylines = more chances to win!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <div className="col-span-1 flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-sm">
          <div className="flex flex-col">
            <span className="font-bold text-sm">BET PER LINE</span>
            <div className="flex space-x-2 mt-1">
              <button 
                className="text-xs font-bold bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-md"
                onClick={setMinBet}
                disabled={state.isSpinning}
              >
                MIN
              </button>
              <button 
                className="text-xs font-bold bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-md"
                onClick={setMaxBet}
                disabled={state.isSpinning}
              >
                MAX
              </button>
            </div>
          </div>
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
      
      {/* Auto play toggle and Total Bet display */}
      <div className="flex justify-between items-center mb-4">
        <button 
          className={`flex items-center justify-center rounded-xl p-2 px-4 shadow-sm transition-all ${
            state.autoPlay 
              ? 'bg-candy-button-primary text-white' 
              : 'bg-white/30 backdrop-blur-sm'
          }`}
          onClick={() => {
            playSoundIfEnabled('buttonClick');
            toggleAutoPlay();
          }}
          disabled={state.isSpinning}
        >
          {state.autoPlay ? (
            <>
              <Pause className="mr-1" size={16} />
              <span className="font-bold text-sm">AUTO ON</span>
            </>
          ) : (
            <>
              <PlayCircle className="mr-1" size={16} />
              <span className="font-bold text-sm">AUTO OFF</span>
            </>
          )}
        </button>
        
        <div className="bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
          <div className="text-sm font-bold mb-0">TOTAL BET</div>
          <div className="flex items-center justify-center">
            <span className="pi-coin">π</span>
            <span className="font-bold">{formatNumber(state.totalBet)}</span>
          </div>
        </div>
      </div>
      
      {/* Spin button */}
      <button 
        className={`candy-button w-full py-4 text-xl ${state.isSpinning ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handleSpin}
        disabled={state.isSpinning || state.balance < state.totalBet}
      >
        {state.freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
      </button>
    </div>
  );
};

export default GameControls;
