
import React, { useReducer, useEffect } from 'react';
import { SpinResult } from '../types/game';
import { evaluateSpin, generateGrid } from '../utils/gameLogic';
import { GameContext, GameContextType } from './gameContext';
import { gameReducer, initialState } from './gameReducer';

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
  
  // Admin features
  const toggleAdminMode = () => {
    dispatch({ type: 'TOGGLE_ADMIN_MODE' });
  };
  
  const setBalance = (amount: number) => {
    dispatch({ type: 'SET_BALANCE', amount });
  };
  
  const setFreeSpins = (count: number) => {
    dispatch({ type: 'SET_FREE_SPINS', count });
  };
  
  const setJackpot = (amount: number) => {
    dispatch({ type: 'UPDATE_JACKPOT', amount });
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
  
  const contextValue: GameContextType = {
    state,
    spin,
    updateBet,
    updateLines,
    toggleAutoPlay,
    resetGame,
    toggleAdminMode,
    setBalance,
    setFreeSpins,
    setJackpot
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
