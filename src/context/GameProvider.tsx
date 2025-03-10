
import React, { useReducer, useEffect } from 'react';
import { SpinResult, WinForceType } from '../types/game';
import { evaluateSpin, generateGrid, generateForcedWinGrid } from '../utils/gameLogic';
import { GameContext, GameContextType } from './gameContext';
import { gameReducer, initialState } from './gameReducer';
import { stopAllSounds, playSoundIfEnabled } from '../utils/soundUtils';

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Function to spin the reels
  const spin = () => {
    // Prevent spinning if already spinning
    if (state.isSpinning) return;
    
    // Stop all existing sounds
    stopAllSounds();
    
    // Start spin
    dispatch({ type: 'SPIN_START' });
    
    // Simulate delay for spinning animation (2 seconds)
    setTimeout(() => {
      let grid;
      
      // If in admin mode and a forced win type is set, generate a grid with that win
      if (state.adminMode && state.forcedWinType) {
        grid = generateForcedWinGrid(state.forcedWinType);
        // Reset forced win after use
        dispatch({ type: 'FORCE_WIN', winType: null });
      } else {
        // Generate random grid and evaluate results
        grid = generateGrid();
      }
      
      const result = evaluateSpin(grid, state.bet, state.lines);
      
      // End spin with results
      dispatch({ type: 'SPIN_END', result });
      
      // Decrement free spins if in free spin mode
      if (state.freeSpinsRemaining > 0) {
        dispatch({ type: 'USE_FREE_SPIN' });
      }
      
      // Play appropriate sound based on result
      handleResultSounds(result);
    }, 2000);
  };
  
  // Function to play sounds based on spin result
  const handleResultSounds = (result: SpinResult) => {
    if (result.isJackpot && state.isJackpotActive) {
      playSoundIfEnabled('jackpot', 1.0);
    } else if (result.totalWin >= state.bet * 20) {
      playSoundIfEnabled('bigWin', 0.8);
    } else if (result.totalWin > 0) {
      playSoundIfEnabled('win', 0.6);
    }
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
  
  const forceWin = (winType: WinForceType) => {
    dispatch({ type: 'FORCE_WIN', winType });
  };
  
  const toggleTestMode = () => {
    dispatch({ type: 'TOGGLE_TEST_MODE' });
  };
  
  // Effect for auto play
  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null;
    
    if (state.autoPlay && !state.isSpinning && (state.balance >= state.totalBet || state.freeSpinsRemaining > 0)) {
      autoPlayInterval = setInterval(() => {
        spin();
      }, 3000); // Auto spin every 3 seconds
    } else if (!state.autoPlay || state.balance < state.totalBet) {
      // Cancel auto play if balance is too low or auto play toggled off
      if (state.autoPlay && state.balance < state.totalBet && state.freeSpinsRemaining <= 0) {
        dispatch({ type: 'TOGGLE_AUTO_PLAY' });
      }
    }
    
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [state.autoPlay, state.isSpinning, state.balance, state.totalBet, state.freeSpinsRemaining]);
  
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
    setJackpot,
    forceWin,
    toggleTestMode
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
