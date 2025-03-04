
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useGame } from "./GameContext";
import { formatNumber } from "../utils/gameLogic";
import { playSoundIfEnabled, toggleMute, isSoundMuted } from "../utils/soundUtils";
import { 
  Menu, 
  VolumeX, 
  Volume2, 
  HelpCircle, 
  Settings, 
  RefreshCw,
  ListChecks
} from "lucide-react";

interface MainMenuProps {
  onOpenSettings: () => void;
  onOpenPayTable: () => void;
  onOpenAbout: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onOpenSettings, onOpenPayTable, onOpenAbout }) => {
  const { state, resetGame } = useGame();
  const [isMuted, setIsMuted] = React.useState(isSoundMuted());
  
  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    playSoundIfEnabled('buttonClick');
  };
  
  const handleMenuItemClick = () => {
    playSoundIfEnabled('buttonClick');
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="absolute top-4 left-4 w-10 h-10 bg-[#9b87f5] rounded-full flex items-center justify-center text-white shadow-md z-10"
          onClick={() => playSoundIfEnabled('buttonClick')}
        >
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="candy-panel border-r-4 border-candy-border max-w-xs">
        <div className="flex flex-col h-full">
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <img src="/assets/images/pi-logo.png" alt="Pi Network" className="w-8 h-8" />
              <h2 className="text-xl font-bold">Pi Slots</h2>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex-1 py-6 space-y-6">
            {/* Stats Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-xs text-muted-foreground">Balance</span>
                  <div className="flex items-center">
                    <span className="pi-coin">π</span>
                    <span className="font-bold">{formatNumber(state.balance)}</span>
                  </div>
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-xs text-muted-foreground">Last Win</span>
                  <div className="flex items-center">
                    <span className="pi-coin">π</span>
                    <span className="font-bold">{formatNumber(state.lastWin)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Menu Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground">Game Options</h3>
              
              <SheetClose asChild>
                <button 
                  className="menu-button"
                  onClick={() => {
                    handleMenuItemClick();
                    onOpenPayTable();
                  }}
                >
                  <ListChecks size={18} />
                  <span>Pay Table</span>
                </button>
              </SheetClose>
              
              <SheetClose asChild>
                <button 
                  className="menu-button"
                  onClick={() => {
                    handleMenuItemClick();
                    onOpenAbout();
                  }}
                >
                  <HelpCircle size={18} />
                  <span>How to Play</span>
                </button>
              </SheetClose>
              
              <SheetClose asChild>
                <button 
                  className="menu-button"
                  onClick={() => {
                    handleMenuItemClick();
                    onOpenSettings();
                  }}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </SheetClose>
              
              <button 
                className="menu-button"
                onClick={handleToggleMute}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={18} />
                    <span>Unmute Sounds</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} />
                    <span>Mute Sounds</span>
                  </>
                )}
              </button>
              
              <SheetClose asChild>
                <button 
                  className="menu-button text-red-500"
                  onClick={() => {
                    handleMenuItemClick();
                    resetGame();
                  }}
                >
                  <RefreshCw size={18} />
                  <span>Reset Game</span>
                </button>
              </SheetClose>
            </div>
          </div>
          
          <Separator />
          
          <div className="py-4">
            <p className="text-xs text-center text-muted-foreground">
              Pi Slots v1.0 - Made for Pi Network
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
