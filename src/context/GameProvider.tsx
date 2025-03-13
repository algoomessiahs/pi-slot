
import React, { useReducer, useEffect, useState } from 'react';
import { SpinResult, WinForceType } from '../types/game';
import { evaluateSpin, generateGrid, generateForcedWinGrid } from '../utils/gameLogic';
import { GameContext, GameContextType } from './gameContext';
import { gameReducer, initialState } from './gameReducer';
import { stopAllSounds, playSoundIfEnabled } from '../utils/soundUtils';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize game state from database when user logs in
  useEffect(() => {
    if (user && !initialized) {
      initializeGameState();
    }
  }, [user, initialized]);
  
  // Function to initialize game state from database
  const initializeGameState = async () => {
    if (!user) return;
    
    try {
      // Get user profile to get balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profile) {
        dispatch({ type: 'SET_BALANCE', amount: profile.balance });
      }
      
      // Get jackpot info
      const { data: jackpot, error: jackpotError } = await supabase
        .from('jackpot')
        .select('amount, is_active')
        .single();
      
      if (jackpotError) throw jackpotError;
      
      if (jackpot) {
        dispatch({ type: 'UPDATE_JACKPOT', amount: jackpot.amount });
      }
      
      // Create a new session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert([{ user_id: user.id }])
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      if (session) {
        setSessionId(session.id);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing game state:', error);
      // Initialize with default values in case of error
      setInitialized(true);
    }
  };
  
  // Function to update jackpot in database
  const updateJackpotInDatabase = async (amount: number) => {
    try {
      await supabase
        .from('jackpot')
        .update({ amount })
        .eq('id', 1);
    } catch (error) {
      console.error('Error updating jackpot:', error);
    }
  };
  
  // Function to update user balance in database
  const updateUserBalance = async (newBalance: number) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating user balance:', error);
    }
  };
  
  // Function to record a transaction
  const recordTransaction = async (type: 'win' | 'loss', amount: number, details: any = {}) => {
    if (!user) return;
    
    try {
      await supabase
        .from('game_transactions')
        .insert([{
          user_id: user.id,
          transaction_type: type,
          amount,
          details
        }]);
    } catch (error) {
      console.error('Error recording transaction:', error);
    }
  };
  
  // Function to record a spin result
  const recordSpinResult = async (result: SpinResult, betAmount: number, linesPlayed: number) => {
    if (!user || !sessionId) return;
    
    try {
      await supabase
        .from('spin_results')
        .insert([{
          session_id: sessionId,
          user_id: user.id,
          grid: result.grid,
          bet_amount: betAmount,
          win_amount: result.totalWin,
          lines_played: linesPlayed,
          is_jackpot: result.isJackpot,
          is_free_spin: result.isFreeSpins
        }]);
      
      // Update session stats
      await supabase
        .from('game_sessions')
        .update({
          total_spins: supabase.rpc('increment', { inc: 1 }),
          total_bet: supabase.rpc('add_amount', { amount: betAmount }),
          total_win: supabase.rpc('add_amount', { amount: result.totalWin })
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error recording spin result:', error);
    }
  };
  
  // Function to end current session
  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('game_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };
  
  // Sign out handler
  useEffect(() => {
    if (!user && initialized) {
      endSession();
      // Reset session ID
      setSessionId(null);
      setInitialized(false);
    }
  }, [user, initialized]);
  
  // Function to spin the reels
  const spin = async () => {
    // Prevent spinning if already spinning
    if (state.isSpinning) return;
    
    // If not logged in, prompt to sign in
    if (!user && !state.adminMode) {
      toast.error('Please sign in to play!');
      return;
    }
    
    // Stop all existing sounds
    stopAllSounds();
    
    // Start spin
    dispatch({ type: 'SPIN_START' });
    
    // Check if this is a free spin
    const isFreeSpinUsed = state.freeSpinsRemaining > 0;
    const betAmount = state.bet * state.lines;
    
    // Contribute to jackpot and update in database
    if (!isFreeSpinUsed) {
      const jackpotContribution = betAmount * 0.05; // 5% to jackpot
      await updateJackpotInDatabase(state.jackpot + jackpotContribution);
    }
    
    // Simulate delay for spinning animation (2 seconds)
    setTimeout(async () => {
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
      
      // Record spin result in database
      if (user && !state.adminMode) {
        await recordSpinResult(result, betAmount, state.lines);
        
        // Record transaction
        if (!isFreeSpinUsed) {
          // Record loss transaction (bet amount)
          await recordTransaction('loss', betAmount, { 
            type: 'bet',
            lines: state.lines,
            bet_per_line: state.bet 
          });
        }
        
        // If there's a win, record it
        if (result.totalWin > 0) {
          await recordTransaction('win', result.totalWin, {
            spin_result: result.isJackpot ? 'jackpot' : 'regular',
            win_lines: result.winLines.length
          });
        }
        
        // Update user balance after win
        await updateUserBalance(state.balance);
      }
      
      // If jackpot won, update jackpot in database
      if (result.isJackpot && state.isJackpotActive && user) {
        await supabase
          .from('jackpot')
          .update({ 
            amount: 0,
            is_active: false,
            last_won_at: new Date().toISOString(),
            last_won_by: user.id
          })
          .eq('id', 1);
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
  
  const setBalance = async (amount: number) => {
    dispatch({ type: 'SET_BALANCE', amount });
    
    if (user) {
      await updateUserBalance(amount);
    }
  };
  
  const setFreeSpins = (count: number) => {
    dispatch({ type: 'SET_FREE_SPINS', count });
  };
  
  const setJackpot = async (amount: number) => {
    dispatch({ type: 'UPDATE_JACKPOT', amount });
    
    await updateJackpotInDatabase(amount);
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
