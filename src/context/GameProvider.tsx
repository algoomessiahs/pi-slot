import React, { useReducer, useEffect, useState } from 'react';
import { SpinResult, WinForceType } from '../types/game';
import { evaluateSpin, generateGrid, generateForcedWinGrid } from '../utils/gameLogic';
import { GameContext, GameContextType } from './gameContext';
import { gameReducer, initialState } from './gameReducer';
import { stopAllSounds, playSoundIfEnabled } from '../utils/soundUtils';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (user && !initialized) {
      initializeGameState();
    }
  }, [user, initialized]);
  
  const initializeGameState = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profile) {
        dispatch({ type: 'SET_BALANCE', amount: profile.balance });
      }
      
      const { data: jackpot, error: jackpotError } = await supabase
        .from('jackpot')
        .select('amount, is_active')
        .single();
      
      if (jackpotError) throw jackpotError;
      
      if (jackpot) {
        dispatch({ type: 'UPDATE_JACKPOT', amount: jackpot.amount });
      }
      
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
      setInitialized(true);
    }
  };
  
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
      
      await supabase
        .from('game_sessions')
        .update({
          total_spins: supabase.rpc('increment', { x: 1 }),
          total_bet: supabase.rpc('add_amount', { x: betAmount }),
          total_win: supabase.rpc('add_amount', { x: result.totalWin })
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error recording spin result:', error);
    }
  };
  
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
  
  useEffect(() => {
    if (!user && initialized) {
      endSession();
      setSessionId(null);
      setInitialized(false);
    }
  }, [user, initialized]);
  
  const spin = async () => {
    if (state.isSpinning) return;
    
    if (!user && !state.adminMode) {
      toast.error('Please sign in to play!');
      return;
    }
    
    stopAllSounds();
    
    dispatch({ type: 'SPIN_START' });
    
    const isFreeSpinUsed = state.freeSpinsRemaining > 0;
    const betAmount = state.bet * state.lines;
    
    if (!isFreeSpinUsed) {
      const jackpotContribution = betAmount * 0.05;
      await updateJackpotInDatabase(state.jackpot + jackpotContribution);
    }
    
    setTimeout(async () => {
      let grid;
      
      if (state.adminMode && state.forcedWinType) {
        grid = generateForcedWinGrid(state.forcedWinType);
        dispatch({ type: 'FORCE_WIN', winType: null });
      } else {
        grid = generateGrid();
      }
      
      const result = evaluateSpin(grid, state.bet, state.lines);
      
      dispatch({ type: 'SPIN_END', result });
      
      if (state.freeSpinsRemaining > 0) {
        dispatch({ type: 'USE_FREE_SPIN' });
      }
      
      if (user && !state.adminMode) {
        await recordSpinResult(result, betAmount, state.lines);
        
        if (!isFreeSpinUsed) {
          await recordTransaction('loss', betAmount, { 
            type: 'bet',
            lines: state.lines,
            bet_per_line: state.bet 
          });
        }
        
        if (result.totalWin > 0) {
          await recordTransaction('win', result.totalWin, {
            spin_result: result.isJackpot ? 'jackpot' : 'regular',
            win_lines: result.winLines.length
          });
        }
        
        await updateUserBalance(state.balance);
      }
      
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
      
      handleResultSounds(result);
    }, 2000);
  };
  
  const handleResultSounds = (result: SpinResult) => {
    if (result.isJackpot && state.isJackpotActive) {
      playSoundIfEnabled('jackpot', 1.0);
    } else if (result.totalWin >= state.bet * 20) {
      playSoundIfEnabled('bigWin', 0.8);
    } else if (result.totalWin > 0) {
      playSoundIfEnabled('win', 0.6);
    }
  };
  
  const updateBet = (amount: number) => {
    dispatch({ type: 'UPDATE_BET', amount });
  };
  
  const updateLines = (lines: number) => {
    dispatch({ type: 'UPDATE_LINES', lines });
  };
  
  const toggleAutoPlay = () => {
    dispatch({ type: 'TOGGLE_AUTO_PLAY' });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
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
  
  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null;
    
    if (state.autoPlay && !state.isSpinning && (state.balance >= state.totalBet || state.freeSpinsRemaining > 0)) {
      autoPlayInterval = setInterval(() => {
        spin();
      }, 3000);
    } else if (!state.autoPlay || state.balance < state.totalBet) {
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
