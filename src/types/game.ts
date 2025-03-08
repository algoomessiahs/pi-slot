
export type SymbolType = 
  | 'pi-logo' 
  | 'pi-symbol' 
  | 'pi-314' 
  | 'pi-bcv' 
  | 'pi-node' 
  | 'pi-314-alt' 
  | 'pi-symbol-alt' 
  | 'pi-node-alt' 
  | 'pi-special';

export interface Symbol {
  id: SymbolType;
  name: string;
  image: string;
  value: number;
  isSpecial: boolean;
  cropPosition?: {
    top: number;
    height: number;
  };
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
