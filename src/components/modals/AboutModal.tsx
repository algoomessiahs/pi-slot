
import React from "react";
import { Coins, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { playSound } from "../../utils/soundUtils";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onOpenChange }) => {
  const handleClose = () => {
    playSound('click');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="candy-panel max-w-md mx-auto p-0 border-none">
        <div className="relative candy-panel overflow-hidden">
          {/* Pi Network logo banner */}
          <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 -mx-6 -mt-6 mb-8 flex items-center justify-center">
            <img 
              src="/assets/images/pi-network-logo.png" 
              alt="Pi Network" 
              className="h-20 object-contain"
            />
          </div>
          
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md z-10"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
          
          <h2 className="text-2xl font-bold text-center mb-6">About Pi Jackpot</h2>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md mr-3">
                π
              </div>
              <h3 className="text-lg font-bold">Pi Network Integration</h3>
            </div>
            <p className="text-sm mb-4">
              This game integrates with Pi Network allowing you to play using Pi cryptocurrency. 
              Connect your Pi wallet to start playing with real Pi coins.
            </p>
            <p className="text-sm mb-2">
              Pi Jackpot uses the official Pi Network payment platform for secure transactions.
            </p>
            
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <h4 className="font-bold mb-2">What is Pi Network?</h4>
              <p className="text-sm">
                Pi Network is a digital currency project that aims to make cryptocurrency accessible to everyday people. 
                Unlike Bitcoin mining, Pi can be mined on your phone without draining your battery.
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">How to Play</h3>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Set your bet amount and number of paylines</li>
              <li>Click SPIN to play</li>
              <li>Match symbols across active paylines to win</li>
              <li>Get special symbols for bonus features</li>
              <li>5 JACKPOT symbols wins the progressive jackpot!</li>
            </ol>
          </div>
          
          <div className="flex justify-between mb-6">
            <div className="w-1/2 pr-2">
              <h3 className="text-lg font-bold mb-2">Special Features</h3>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Progressive jackpot</li>
                <li>Free spins bonus round</li>
                <li>Wild symbols</li>
                <li>Scatter symbols</li>
              </ul>
            </div>
            
            <div className="w-1/2 pl-2">
              <h3 className="text-lg font-bold mb-2">Bonus Games</h3>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Pi Pioneer Challenge</li>
                <li>Blockchain Bonanza</li>
                <li>Crypto Treasure</li>
                <li>Mining Madness</li>
              </ul>
            </div>
          </div>
          
          <button 
            className="candy-button w-full mt-2"
            onClick={handleClose}
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
