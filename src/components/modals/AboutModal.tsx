
import React from "react";
import { Coins, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { playSoundIfEnabled } from "../../utils/soundUtils";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="candy-panel max-w-md mx-auto p-0 border-none">
        <div className="relative candy-panel">
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md"
            onClick={() => {
              playSoundIfEnabled('buttonClick');
              onOpenChange(false);
            }}
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/images/pi-logo.png" alt="Pi Network" className="w-16 h-16 mr-3" />
            <h2 className="text-2xl font-bold">Pi Slots</h2>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-full flex items-center justify-center text-white font-bold shadow-md mr-3">
                π
              </div>
              <h3 className="text-lg font-bold">Pi Network Integration</h3>
            </div>
            <p className="text-sm mb-4">
              This game integrates with Pi Network allowing you to play using Pi cryptocurrency. 
              Connect your Pi wallet to start playing with real Pi coins.
            </p>
            <p className="text-sm mb-2">
              Pi Slots uses the official Pi Network payment platform for secure transactions.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">How to Play</h3>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Set your bet amount per line (10-500π)</li>
              <li>Choose how many paylines to play (1-20)</li>
              <li>Click SPIN to play</li>
              <li>Match symbols across active paylines to win</li>
              <li>Get special symbols for bonus features</li>
              <li>5 JACKPOT symbols wins the progressive jackpot!</li>
            </ol>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Special Features</h3>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Progressive jackpot increases with each bet</li>
              <li>Free spins bonus round</li>
              <li>Wild symbols substitute for any regular symbol</li>
              <li>Scatter symbols award wins regardless of position</li>
            </ul>
          </div>
          
          <button 
            className="candy-button w-full mt-2"
            onClick={() => {
              playSoundIfEnabled('buttonClick');
              onOpenChange(false);
            }}
          >
            <Coins className="inline-block mr-2" size={18} />
            Start Playing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
