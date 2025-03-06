
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, SpinResult } from '../types/game';
import { evaluateSpin, generateGrid } from '../utils/gameLogic';
import { toast } from "sonner";

interface GameContextType {
  state: GameState;
  spin: () => void;
  updateBet: (amount: number) => void;
  updateLines: (lines: number) => void;
  toggleAutoPlay: () => void;
  resetGame: () => void;
}

// Initial game state
const initialState: GameState = {
  balance: 100, // Start with 100 Pi
  bet: 1, // Default bet is 1 Pi
  lines: 3, // Default to 3 lines (out of 8)
  jackpot: 100, // Start jackpot at 100 Pi
  isSpinning: false,
  lastWin: 0,
  totalBet: 3, // bet * lines
  lastResult: null,
  autoPlay: false,
  freeSpinsRemaining: 0,
  inFreeSpinMode: false,
};

// Bet limits
const MIN_BET = 0.5; // Min bet of 0.5 Pi
const MAX_BET = 10; // Max bet of 10 Pi
const JACKPOT_CONTRIBUTION = 0.05; // 5% of bet goes to jackpot

// Action types
type Action =
  | { type: 'SPIN_START' }
  | { type: 'SPIN_END'; result: SpinResult }
  | { type: 'UPDATE_BET'; amount: number }
  | { type: 'UPDATE_LINES'; lines: number }
  | { type: 'TOGGLE_AUTO_PLAY' }
  | { type: 'UPDATE_JACKPOT'; amount: number }
  | { type: 'RESET_GAME' }
  | { type: 'SET_FREE_SPINS'; count: number }
  | { type: 'USE_FREE_SPIN' };

// Reducer function
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SPIN_START':
      // No balance deduction for free spins
      if (state.freeSpinsRemaining > 0) {
        return {
          ...state,
          isSpinning: true,
        };
      }
      
      // Calculate total bet (bet amount * lines)
      const totalBet = state.bet * state.lines;
      
      // Check if player has enough balance
      if (state.balance < totalBet) {
        toast.error("Not enough Pi to spin!");
        return state;
      }
      
      // Deduct bet from balance, increment jackpot
      return {
        ...state,
        balance: state.balance - totalBet,
        jackpot: state.jackpot + Math.floor(totalBet * JACKPOT_CONTRIBUTION * 100) / 100, // 5% of bet goes to jackpot
        isSpinning: true,
        totalBet,
        lastWin: 0,
      };
    
    case 'SPIN_END':
      let newState = {
        ...state,
        isSpinning: false,
        lastResult: action.result,
      };
      
      // Handle jackpot win
      if (action.result.isJackpot) {
        toast.success(`JACKPOT WIN: ${state.jackpot} Pi!`, {
          duration: 10000
        });
        
        newState = {
          ...newState,
          balance: newState.balance + state.jackpot,
          lastWin: state.jackpot,
          jackpot: initialState.jackpot, // Reset jackpot
        };
      } 
      // Handle regular win
      else if (action.result.totalWin > 0) {
        toast.success(`You won ${action.result.totalWin.toFixed(2)} Pi!`);
        
        newState = {
          ...newState,
          balance: newState.balance + action.result.totalWin,
          lastWin: action.result.totalWin,
        };
      }
      
      // Handle free spins
      if (action.result.isFreeSpins) {
        toast.success(`You won ${action.result.freeSpinsCount} free spins!`);
        
        newState = {
          ...newState,
          freeSpinsRemaining: newState.freeSpinsRemaining + action.result.freeSpinsCount,
          inFreeSpinMode: true,
        };
      }
      
      return newState;
    
    case 'UPDATE_BET':
      // Ensure bet is within acceptable range (MIN_BET-MAX_BET)
      const newBet = Math.max(MIN_BET, Math.min(MAX_BET, action.amount));
      return {
        ...state,
        bet: newBet,
        totalBet: newBet * state.lines,
      };
    
    case 'UPDATE_LINES':
      // Ensure lines is within acceptable range (1-8)
      const newLines = Math.max(1, Math.min(8, action.lines));
      return {
        ...state,
        lines: newLines,
        totalBet: state.bet * newLines,
      };
    
    case 'TOGGLE_AUTO_PLAY':
      return {
        ...state,
        autoPlay: !state.autoPlay,
      };
    
    case 'UPDATE_JACKPOT':
      return {
        ...state,
        jackpot: action.amount,
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        jackpot: state.jackpot, // Keep jackpot amount
      };
    
    case 'SET_FREE_SPINS':
      return {
        ...state,
        freeSpinsRemaining: action.count,
        inFreeSpinMode: action.count > 0,
      };
    
    case 'USE_FREE_SPIN':
      const freeSpinsRemaining = state.freeSpinsRemaining - 1;
      return {
        ...state,
        freeSpinsRemaining,
        inFreeSpinMode: freeSpinsRemaining > 0,
      };
    
    default:
      return state;
  }
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Function to spin the reels
  const spin = () => {
    // Prevent spinning if already spinning
    if (state.isSpinning) return;
    
    // Start spin
    dispatch({ type: 'SPIN_START' });
    
    // Simulate delay for spinning animation (2 seconds)
    setTimeout(() => {
      // Generate random grid and evaluate results
      const grid = generateGrid();
      const result = evaluateSpin(grid, state.bet, state.lines);
      
      // End spin with results
      dispatch({ type: 'SPIN_END', result });
      
      // Decrement free spins if in free spin mode
      if (state.freeSpinsRemaining > 0) {
        dispatch({ type: 'USE_FREE_SPIN' });
      }
    }, 2000);
  };
  
  // Function to update bet amount
  const updateBet = (amount: number) => {
    dispatch({ type: 'UPDATE_BET', amount });
  };
  
  // Function to update number of lines
  const updateLines = (lines: number) => {
    dispatch({ type: 'UPDATE_LINES', lines });
  };
  
  // Function to toggle auto play
  const toggleAutoPlay = () => {
    dispatch({ type: 'TOGGLE_AUTO_PLAY' });
  };
  
  // Function to reset game
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  // Effect for auto play
  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null;
    
    if (state.autoPlay && !state.isSpinning) {
      autoPlayInterval = setInterval(() => {
        spin();
      }, 3000); // Auto spin every 3 seconds
    }
    
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [state.autoPlay, state.isSpinning]);
  
  return (
    <GameContext.Provider value={{ state, spin, updateBet, updateLines, toggleAutoPlay, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
