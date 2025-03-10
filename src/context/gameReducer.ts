
import { GameState, SpinResult, WinForceType } from '../types/game';
import { GameAction } from './gameActions';
import { toast } from "sonner";
import { stopAllSounds } from '../utils/soundUtils';

// Initial game state
export const initialState: GameState = {
  balance: 100, // Start with 100 Pi
  bet: 1, // Default bet is 1 Pi
  lines: 3, // Default to 3 lines (out of 8)
  jackpot: 0, // Start jackpot at 0 Pi, will build up from bets
  isSpinning: false,
  lastWin: 0,
  totalBet: 3, // bet * lines
  lastResult: null,
  autoPlay: false,
  freeSpinsRemaining: 0,
  inFreeSpinMode: false,
  isJackpotActive: false, // Flag to indicate if jackpot is active
  adminMode: false, // Admin mode for testing (default off)
  forcedWinType: null, // No forced win by default
  testMode: false, // Test mode off by default
};

// Bet limits
export const MIN_BET = 0.5; // Min bet of 0.5 Pi
export const MAX_BET = 10; // Max bet of 10 Pi
export const JACKPOT_CONTRIBUTION = 0.05; // 5% of bet goes to jackpot
export const JACKPOT_THRESHOLD = 100; // Jackpot activates at 100 Pi

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
      
      // Calculate jackpot contribution
      const jackpotContribution = totalBet * JACKPOT_CONTRIBUTION;
      const newJackpot = state.jackpot + jackpotContribution;
      
      // Check if jackpot should be activated
      const isJackpotActive = newJackpot >= JACKPOT_THRESHOLD;
      
      if (isJackpotActive && !state.isJackpotActive) {
        toast.success("JACKPOT IS ACTIVE! 🎉", {
          duration: 5000
        });
      }
      
      // Deduct bet from balance, increment jackpot
      return {
        ...state,
        balance: state.balance - totalBet,
        jackpot: newJackpot,
        isJackpotActive,
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
      
      // Handle jackpot win (only if jackpot is active)
      if (action.result.isJackpot && state.isJackpotActive) {
        toast.success(`JACKPOT WIN: ${state.jackpot.toFixed(2)} Pi!`, {
          duration: 10000
        });
        
        newState = {
          ...newState,
          balance: newState.balance + state.jackpot,
          lastWin: state.jackpot,
          jackpot: 0, // Reset jackpot
          isJackpotActive: false, // Deactivate jackpot after win
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
      const newAutoPlay = !state.autoPlay;
      
      // If turning off autoplay, ensure all sounds stop
      if (!newAutoPlay) {
        stopAllSounds();
      }
      
      return {
        ...state,
        autoPlay: newAutoPlay,
      };
    
    case 'UPDATE_JACKPOT':
      const isNewJackpotActive = action.amount >= JACKPOT_THRESHOLD;
      
      // Notify if jackpot becomes active
      if (isNewJackpotActive && !state.isJackpotActive) {
        toast.success("JACKPOT IS ACTIVE! 🎉", {
          duration: 5000
        });
      }
      
      return {
        ...state,
        jackpot: action.amount,
        isJackpotActive: isNewJackpotActive,
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        jackpot: state.jackpot, // Keep jackpot amount
        adminMode: state.adminMode, // Keep admin mode setting
        testMode: state.testMode, // Keep test mode setting
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
      
    case 'TOGGLE_ADMIN_MODE':
      return {
        ...state,
        adminMode: !state.adminMode,
      };
      
    case 'SET_BALANCE':
      return {
        ...state,
        balance: action.amount,
      };
    
    case 'FORCE_WIN':
      if (action.winType) {
        toast.info(`Forced ${action.winType} win activated`);
      }
      
      return {
        ...state,
        forcedWinType: action.winType,
      };
    
    case 'TOGGLE_TEST_MODE':
      const newTestMode = !state.testMode;
      
      if (newTestMode) {
        toast.info("Test mode activated - House edge reduced");
      } else {
        toast.info("Test mode deactivated - Normal house edge");
      }
      
      return {
        ...state,
        testMode: newTestMode,
      };
      
    default:
      return state;
  }
};
