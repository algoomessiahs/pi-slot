
import React, { useState } from "react";
import { FolderCog, Volume2, VolumeX, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useGame } from "../GameContext";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { resetGame } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  const handleResetGame = () => {
    resetGame();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="candy-panel max-w-md mx-auto p-0 border-none">
        <div className="relative candy-panel">
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
          
          <h2 className="text-2xl font-bold text-center mb-6">Settings</h2>
          
          <div className="space-y-6">
            {/* Audio settings */}
            <div className="bg-white/40 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4">Audio Settings</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Volume2 className="mr-2" size={20} />
                  <span>Sound Effects</span>
                </div>
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled} 
                  className="data-[state=checked]:bg-candy-button-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="mr-2" size={20} />
                  <span>Background Music</span>
                </div>
                <Switch 
                  checked={musicEnabled} 
                  onCheckedChange={setMusicEnabled}
                  className="data-[state=checked]:bg-candy-button-primary"
                />
              </div>
            </div>
            
            {/* Game settings */}
            <div className="bg-white/40 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4">Game Settings</h3>
              
              <button 
                className="secondary-button w-full mb-3"
                onClick={handleResetGame}
              >
                Reset Game
              </button>
              
              <p className="text-xs text-gray-600">
                Resetting will restore your initial balance but will not affect the jackpot value.
              </p>
            </div>
            
            {/* Legal info */}
            <div className="space-y-2">
              <button className="secondary-button w-full text-sm">Terms of Use</button>
              <button className="secondary-button w-full text-sm">Privacy Policy</button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            Version 1.0.0 • Pi Jackpot Spins
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
