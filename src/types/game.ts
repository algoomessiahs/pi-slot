
export type SymbolType = 
  | 'donut-white' 
  | 'donut-yellow' 
  | 'donut-pink' 
  | 'donut-red' 
  | 'donut-purple' 
  | 'donut-brown' 
  | 'letter-a' 
  | 'letter-n' 
  | 'letter-k' 
  | 'letter-l' 
  | 'letter-m' 
  | 'special-wild' 
  | 'special-scatter' 
  | 'special-free-spin' 
  | 'special-bonus' 
  | 'special-jackpot';

export interface Symbol {
  id: SymbolType;
  name: string;
  image: string;
  value: number;
  isSpecial: boolean;
}

export interface WinLine {
  line: number;
  symbols: SymbolType[];
  positions: number[];
  winAmount: number;
}

export interface SpinResult {
  grid: SymbolType[][];
  winLines: WinLine[];
  totalWin: number;
  isJackpot: boolean;
  isFreeSpins: boolean;
  freeSpinsCount: number;
  isBonus: boolean;
}

export interface GameState {
  balance: number;
  bet: number;
  lines: number;
  jackpot: number;
  isSpinning: boolean;
  lastWin: number;
  totalBet: number;
  lastResult: SpinResult | null;
  autoPlay: boolean;
  freeSpinsRemaining: number;
  inFreeSpinMode: boolean;
}
