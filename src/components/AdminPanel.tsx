
import React, { useState } from 'react';
import { useGame } from '../context/gameContext';
import { 
  SettingsIcon, 
  KeyIcon, 
  CoinsIcon,
  TrophyIcon,
  FolderIcon,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel: React.FC = () => {
  const { 
    state, 
    toggleAdminMode, 
    setBalance, 
    setFreeSpins, 
    setJackpot,
    resetGame
  } = useGame();
  
  const [balanceInput, setBalanceInput] = useState(state.balance.toString());
  const [freeSpinsInput, setFreeSpinsInput] = useState('0');
  const [jackpotInput, setJackpotInput] = useState(state.jackpot.toString());
  
  const handleBalanceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(balanceInput);
    if (!isNaN(amount) && amount >= 0) {
      setBalance(amount);
      toast.success(`Balance set to π${amount}`);
    } else {
      toast.error("Please enter a valid amount");
    }
  };
  
  const handleFreeSpinsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(freeSpinsInput);
    if (!isNaN(count) && count >= 0) {
      setFreeSpins(count);
      toast.success(`Free spins set to ${count}`);
    } else {
      toast.error("Please enter a valid number");
    }
  };
  
  const handleJackpotUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(jackpotInput);
    if (!isNaN(amount) && amount >= 0) {
      setJackpot(amount);
      toast.success(`Jackpot set to π${amount}`);
    } else {
      toast.error("Please enter a valid amount");
    }
  };
  
  if (!state.adminMode) {
    return null;
  }
  
  return (
    <div className="admin-panel fixed top-2 left-2 z-50 bg-black/90 text-white p-4 rounded-xl border border-purple-500 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center">
          <KeyIcon size={16} className="mr-1 text-yellow-400" />
          Admin Panel
        </h3>
        <button 
          onClick={toggleAdminMode}
          className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Balance Control */}
        <form onSubmit={handleBalanceUpdate} className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs mb-1 text-gray-300">Balance</label>
            <div className="flex">
              <span className="bg-purple-900 text-white px-2 flex items-center rounded-l">π</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="bg-purple-800 text-white px-2 py-1 w-full rounded-r text-sm"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded self-end"
          >
            Set
          </button>
        </form>
        
        {/* Free Spins Control */}
        <form onSubmit={handleFreeSpinsUpdate} className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs mb-1 text-gray-300">Free Spins</label>
            <input
              type="number"
              min="0"
              value={freeSpinsInput}
              onChange={(e) => setFreeSpinsInput(e.target.value)}
              className="bg-purple-800 text-white px-2 py-1 w-full rounded text-sm"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded self-end"
          >
            Set
          </button>
        </form>
        
        {/* Jackpot Control */}
        <form onSubmit={handleJackpotUpdate} className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs mb-1 text-gray-300">Jackpot</label>
            <div className="flex">
              <span className="bg-purple-900 text-white px-2 flex items-center rounded-l">π</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={jackpotInput}
                onChange={(e) => setJackpotInput(e.target.value)}
                className="bg-purple-800 text-white px-2 py-1 w-full rounded-r text-sm"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded self-end"
          >
            Set
          </button>
        </form>
        
        {/* Reset Game Button */}
        <button 
          onClick={() => {
            resetGame();
            toast.success("Game reset");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm w-full flex items-center justify-center"
        >
          <RotateCcw size={14} className="mr-1" />
          Reset Game
        </button>
        
        {/* Admin Info */}
        <div className="text-xs text-gray-400 mt-2">
          <p>This panel is only visible in admin mode and should be removed in production.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
