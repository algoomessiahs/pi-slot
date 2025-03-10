
import { createContext, useContext } from 'react';
import { GameState } from '../types/game';

// Define the context type
export interface GameContextType {
  state: GameState;
  spin: () => void;
  updateBet: (amount: number) => void;
  updateLines: (lines: number) => void;
  toggleAutoPlay: () => void;
  resetGame: () => void;
  toggleAdminMode: () => void; // Admin feature
  setBalance: (amount: number) => void; // Admin feature
  setFreeSpins: (count: number) => void; // Admin feature
  setJackpot: (amount: number) => void; // Admin feature
}

// Create context
export const GameContext = createContext<GameContextType | undefined>(undefined);

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
