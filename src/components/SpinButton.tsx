
import React from "react";
import { playSoundIfEnabled, stopAllSounds } from "../utils/soundUtils";

interface SpinButtonProps {
  onSpin: () => void;
  disabled: boolean;
  freeSpinsRemaining: number;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onSpin, disabled, freeSpinsRemaining }) => {
  const handleSpin = () => {
    if (!disabled) {
      // Stop any existing sounds before playing the button click
      stopAllSounds();
      playSoundIfEnabled('buttonClick');
      onSpin();
    }
  };
  
  return (
    <button 
      className="candy-button w-full py-3 text-xl mt-2 z-10 relative"
      onClick={handleSpin}
      disabled={disabled}
    >
      {freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
    </button>
  );
};

export default SpinButton;
