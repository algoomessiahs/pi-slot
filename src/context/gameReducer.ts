
import { GameState, SpinResult } from '../types/game';
import { GameAction } from './gameActions';
import { toast } from "sonner";

// Initial game state
export const initialState: GameState = {
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
export const MIN_BET = 0.5; // Min bet of 0.5 Pi
export const MAX_BET = 10; // Max bet of 10 Pi
export const JACKPOT_CONTRIBUTION = 0.05; // 5% of bet goes to jackpot

// Reducer function
export const gameReducer = (state: GameState, action: GameAction): GameState => {
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
