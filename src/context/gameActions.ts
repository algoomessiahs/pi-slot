
import { SpinResult } from '../types/game';

// Action types
export type GameAction =
  | { type: 'SPIN_START' }
  | { type: 'SPIN_END'; result: SpinResult }
  | { type: 'UPDATE_BET'; amount: number }
  | { type: 'UPDATE_LINES'; lines: number }
  | { type: 'TOGGLE_AUTO_PLAY' }
  | { type: 'UPDATE_JACKPOT'; amount: number }
  | { type: 'RESET_GAME' }
  | { type: 'SET_FREE_SPINS'; count: number }
  | { type: 'USE_FREE_SPIN' }
  | { type: 'TOGGLE_ADMIN_MODE' } // For testing features
  | { type: 'SET_BALANCE'; amount: number }; // For admin to set balance
