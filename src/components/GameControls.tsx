
import React from "react";
import { useGame } from "../context/gameContext";
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
    // Decrease by 0.5 Pi for smaller increments
    updateBet(Math.max(0.5, state.bet - 0.5));
  };
  
  const increaseBet = () => {
    playSoundIfEnabled('buttonClick');
    // Increase by 0.5 Pi for smaller increments
    updateBet(Math.min(10, state.bet + 0.5));
  };
  
  // Set min/max bet
  const setMinBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(0.5); // Min bet is 0.5 Pi
  };
  
  const setMaxBet = () => {
    playSoundIfEnabled('buttonClick');
    updateBet(10); // Max bet is 10 Pi
  };
  
  // Handlers for line adjustment
  const decreaseLines = () => {
    playSoundIfEnabled('buttonClick');
    updateLines(Math.max(1, state.lines - 1));
  };
  
  const increaseLines = () => {
    playSoundIfEnabled('buttonClick');
    updateLines(Math.min(8, state.lines + 1));
  };
  
  return (
    <div className="game-controls flex flex-col gap-2">
      {/* Line controls */}
      <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        <div className="flex items-center">
          <span className="font-bold text-xs mr-2">PAYLINES</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onOpenPayTable}
                >
                  <HelpCircle size={12} />
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
            <Minus size={14} />
          </button>
          <span className="mx-2 font-bold text-sm">{state.lines}</span>
          <button 
            className="control-button" 
            onClick={increaseLines}
            disabled={state.lines >= 8 || state.isSpinning}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      {/* Bet controls */}
      <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        <div>
          <span className="font-bold text-xs">BET PER LINE</span>
          <div className="flex space-x-1 mt-0.5">
            <button 
              className="text-[10px] font-bold bg-purple-100 hover:bg-purple-200 px-1.5 py-0.5 rounded-md"
              onClick={setMinBet}
              disabled={state.isSpinning}
            >
              MIN
            </button>
            <button 
              className="text-[10px] font-bold bg-purple-100 hover:bg-purple-200 px-1.5 py-0.5 rounded-md"
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
            disabled={state.bet <= 0.5 || state.isSpinning}
          >
            <Minus size={14} />
          </button>
          <div className="mx-2 flex items-center">
            <span className="pi-coin text-base">π</span>
            <span className="font-bold text-sm">{state.bet.toFixed(1)}</span>
          </div>
          <button 
            className="control-button" 
            onClick={increaseBet}
            disabled={state.bet >= 10 || state.isSpinning}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      {/* Auto play toggle */}
      <button 
        className={`flex items-center justify-center rounded-xl p-1.5 px-4 shadow-sm transition-all ${
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
            <Pause className="mr-1" size={14} />
            <span className="font-bold text-xs">AUTO ON</span>
          </>
        ) : (
          <>
            <PlayCircle className="mr-1" size={14} />
            <span className="font-bold text-xs">AUTO OFF</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GameControls;
