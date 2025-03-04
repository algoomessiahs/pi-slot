
import { SpinResult, SymbolType, WinLine } from "../types/game";
import { SYMBOLS, PAY_LINES, getSymbolById } from "../data/symbols";

// Constants for grid size
const ROWS = 3;
const COLS = 5;

// Probability weights for different symbols
const SYMBOL_WEIGHTS: Record<SymbolType, number> = {
  'donut-white': 20,
  'donut-yellow': 18,
  'donut-pink': 16,
  'donut-red': 14,
  'donut-purple': 12,
  'donut-brown': 10,
  'letter-a': 15,
  'letter-n': 15,
  'letter-k': 15,
  'letter-l': 15,
  'letter-m': 15,
  'special-wild': 4,
  'special-scatter': 3,
  'special-free-spin': 2,
  'special-bonus': 1,
  'special-jackpot': 0.5,
};

// Get a random symbol based on weights
export const getRandomSymbol = (): SymbolType => {
  const symbolIds = Object.keys(SYMBOL_WEIGHTS) as SymbolType[];
  const weights = symbolIds.map(id => SYMBOL_WEIGHTS[id]);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < symbolIds.length; i++) {
    if (random < weights[i]) {
      return symbolIds[i];
    }
    random -= weights[i];
  }
  
  return 'donut-white'; // Default fallback
};

// Generate a grid of random symbols
export const generateGrid = (): SymbolType[][] => {
  const grid: SymbolType[][] = [];
  
  for (let row = 0; row < ROWS; row++) {
    const rowSymbols: SymbolType[] = [];
    for (let col = 0; col < COLS; col++) {
      rowSymbols.push(getRandomSymbol());
    }
    grid.push(rowSymbols);
  }
  
  return grid;
};

// Check if symbols match, accounting for wilds
const symbolsMatch = (symbol1: SymbolType, symbol2: SymbolType): boolean => {
  if (symbol1 === 'special-wild' || symbol2 === 'special-wild') {
    return true;
  }
  return symbol1 === symbol2;
};

// Get symbols along a pay line
const getLineSymbols = (grid: SymbolType[][], line: number[]): SymbolType[] => {
  return line.map((row, col) => grid[row][col]);
};

// Calculate win for a specific line
const calculateLineWin = (lineSymbols: SymbolType[], bet: number): number => {
  // Special case: 5 jackpot symbols = jackpot win
  if (lineSymbols.every(symbol => symbol === 'special-jackpot')) {
    return -1; // Special code for jackpot win
  }
  
  // Special case: 5 wild symbols = 5000x bet
  if (lineSymbols.every(symbol => symbol === 'special-wild')) {
    return bet * 5000;
  }
  
  // Count consecutive matching symbols from left
  let count = 1;
  const firstSymbol = lineSymbols[0];
  
  for (let i = 1; i < lineSymbols.length; i++) {
    if (symbolsMatch(firstSymbol, lineSymbols[i]) || lineSymbols[i] === 'special-wild') {
      count++;
    } else {
      break;
    }
  }
  
  // Calculate win based on symbol value and count
  if (count >= 3) {
    const symbolValue = getSymbolById(firstSymbol === 'special-wild' ? lineSymbols.find(s => s !== 'special-wild') || 'donut-white' : firstSymbol).value;
    let multiplier = 0;
    
    switch (count) {
      case 3: multiplier = 3; break;
      case 4: multiplier = 10; break;
      case 5: multiplier = 50; break;
      default: multiplier = 0;
    }
    
    return bet * multiplier * (symbolValue / 10);
  }
  
  return 0;
};

// Check for scatter symbols and calculate free spins
const checkForFreeSpins = (grid: SymbolType[][]): number => {
  let scatterCount = 0;
  let freeSpinCount = 0;
  
  // Count scatter and free spin symbols
  grid.forEach(row => {
    row.forEach(symbol => {
      if (symbol === 'special-scatter') scatterCount++;
      if (symbol === 'special-free-spin') freeSpinCount++;
    });
  });
  
  // 3 or more scatters trigger free spins
  if (scatterCount >= 3) {
    return 10;
  }
  
  // Direct free spin symbols
  if (freeSpinCount >= 3) {
    return 5 * freeSpinCount;
  }
  
  return 0;
};

// Check if bonus round should be triggered
const checkForBonus = (grid: SymbolType[][]): boolean => {
  let bonusCount = 0;
  
  grid.forEach(row => {
    row.forEach(symbol => {
      if (symbol === 'special-bonus') bonusCount++;
    });
  });
  
  return bonusCount >= 3;
};

// Check if jackpot should be won
const checkForJackpot = (grid: SymbolType[][]): boolean => {
  let jackpotCount = 0;
  
  grid.forEach(row => {
    row.forEach(symbol => {
      if (symbol === 'special-jackpot') jackpotCount++;
    });
  });
  
  return jackpotCount >= 5;
};

// Evaluate all winning lines and calculate total win
export const evaluateSpin = (
  grid: SymbolType[][], 
  bet: number, 
  lines: number
): SpinResult => {
  const winLines: WinLine[] = [];
  let totalWin = 0;
  let isJackpot = false;
  
  // Only evaluate the number of lines the player has bet on
  const activePayLines = PAY_LINES.slice(0, lines);
  
  activePayLines.forEach((payLine, index) => {
    const lineSymbols = getLineSymbols(grid, payLine);
    const win = calculateLineWin(lineSymbols, bet);
    
    if (win === -1) {
      isJackpot = true;
    } else if (win > 0) {
      winLines.push({
        line: index + 1,
        symbols: lineSymbols,
        positions: payLine.map((row, col) => row * COLS + col),
        winAmount: win
      });
      totalWin += win;
    }
  });
  
  const freeSpinsCount = checkForFreeSpins(grid);
  const isBonus = checkForBonus(grid);
  
  // If no regular line wins triggered jackpot, check overall grid
  if (!isJackpot) {
    isJackpot = checkForJackpot(grid);
  }
  
  return {
    grid,
    winLines,
    totalWin,
    isJackpot,
    isFreeSpins: freeSpinsCount > 0,
    freeSpinsCount,
    isBonus
  };
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
