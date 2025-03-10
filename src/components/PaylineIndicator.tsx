
import React from "react";
import { PAYLINE_COLORS } from "../data/symbols";

interface PaylineIndicatorProps {
  activePayline: number | null;
}

const PaylineIndicator: React.FC<PaylineIndicatorProps> = ({ activePayline }) => {
  if (activePayline === null) return null;

  const getPaylineColor = () => {
    if (activePayline !== null && activePayline > 0 && activePayline <= PAYLINE_COLORS.length) {
      return PAYLINE_COLORS[activePayline - 1];
    }
    return '#FFFFFF';
  };

  return (
    <div 
      className="payline-indicator flex items-center justify-center mb-1 py-1 font-medium animate-pulse"
      style={{ color: getPaylineColor() }}
    >
      Winning Line #{activePayline}
    </div>
  );
};

export default PaylineIndicator;
