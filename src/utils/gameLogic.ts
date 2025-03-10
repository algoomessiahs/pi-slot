
import { SpinResult, SymbolType, WinLine } from "../types/game";
import { SYMBOLS, PAY_LINES, getSymbolById, HOUSE_EDGE } from "../data/symbols";

// Constants for grid size
const ROWS = 3;
const COLS = 3; // 3x3 grid

// Probability weights for different symbols - adjusted to favor the house
const SYMBOL_WEIGHTS: Record<string, number> = {
  'pi-logo': 20,      // High frequency, modest payout
  'pi-symbol': 20,    // High frequency, modest payout
  'pi-314': 18,       // Medium frequency
  'pi-bcv': 16,       // Medium frequency
  'pi-node': 14,      // Medium frequency
  'pi-314-alt': 6,    // Low frequency, wild
  'pi-symbol-alt': 10, // Low frequency
  'pi-node-alt': 4,    // Very low frequency, scatter
  'pi-special': 2      // Extremely rare, jackpot
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
  
  return 'pi-logo'; // Default fallback
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

// Generate a grid with forced win - for admin testing
export const generateForcedWinGrid = (winType: 'regular' | 'big' | 'jackpot'): SymbolType[][] => {
  const grid: SymbolType[][] = [];
  
  // Generate a base grid with random symbols
  for (let row = 0; row < ROWS; row++) {
    const rowSymbols: SymbolType[] = [];
    for (let col = 0; col < COLS; col++) {
      rowSymbols.push(getRandomSymbol());
    }
    grid.push(rowSymbols);
  }
  
  // Override with winning pattern based on type
  if (winType === 'jackpot') {
    // Put 3 special symbols in a line for jackpot
    grid[0][0] = 'pi-special';
    grid[0][1] = 'pi-special';
    grid[0][2] = 'pi-special';
  } else if (winType === 'big') {
    // Put 3 high-value symbols in a line
    grid[1][0] = 'pi-logo'; // High value
    grid[1][1] = 'pi-logo';
    grid[1][2] = 'pi-logo';
  } else {
    // Regular win with 3 medium-value symbols
    grid[2][0] = 'pi-bcv'; // Medium value
    grid[2][1] = 'pi-bcv';
    grid[2][2] = 'pi-bcv';
  }
  
  return grid;
};

// Check if symbols match, accounting for wilds
const symbolsMatch = (symbol1: SymbolType, symbol2: SymbolType): boolean => {
  if (symbol1 === 'pi-314-alt' || symbol2 === 'pi-314-alt') {
    return true; // Pi-314-alt is wild
  }
  return symbol1 === symbol2;
};

// Get symbols along a pay line
const getLineSymbols = (grid: SymbolType[][], line: number[]): SymbolType[] => {
  return line.map((row, col) => grid[row][col]);
};

// Calculate win for a specific line
const calculateLineWin = (lineSymbols: SymbolType[], bet: number): number => {
  // Special case: 3 pi-special symbols = jackpot win
  if (lineSymbols.every(symbol => symbol === 'pi-special')) {
    return -1; // Special code for jackpot win
  }
  
  // Special case: 3 wild symbols = 100x bet
  if (lineSymbols.every(symbol => symbol === 'pi-314-alt')) {
    return bet * 100;
  }
  
  // Count consecutive matching symbols from left
  let count = 1;
  const firstSymbol = lineSymbols[0];
  
  for (let i = 1; i < lineSymbols.length; i++) {
    if (symbolsMatch(firstSymbol, lineSymbols[i]) || lineSymbols[i] === 'pi-314-alt') {
      count++;
    } else {
      break;
    }
  }
  
  // For 3x3 grid, we need all 3 symbols to match for a win
  if (count >= 3) {
    const symbolValue = getSymbolById(firstSymbol === 'pi-314-alt' ? lineSymbols.find(s => s !== 'pi-314-alt') || 'pi-logo' : firstSymbol).value;
    return bet * symbolValue * (1 - HOUSE_EDGE); // Apply house edge to wins
  }
  
  return 0;
};

// Check for scatter symbols and calculate free spins
const checkForFreeSpins = (grid: SymbolType[][]): number => {
  let nodeAltCount = 0;
  
  // Count node-alt symbols (scatter)
  grid.forEach(row => {
    row.forEach(symbol => {
      if (symbol === 'pi-node-alt') nodeAltCount++;
    });
  });
  
  // 3 or more scatters trigger free spins
  if (nodeAltCount >= 3) {
    return 5;
  }
  
  // 2 scatters give 1 free spin
  if (nodeAltCount === 2) {
    return 1;
  }
  
  return 0;
};

// Check if jackpot should be won
const checkForJackpot = (grid: SymbolType[][]): boolean => {
  // Check if any row has three pi-special symbols
  // Already checked in calculateLineWin for pay lines, but check for non-payline configurations
  
  let specialCount = 0;
  
  grid.forEach(row => {
    row.forEach(symbol => {
      if (symbol === 'pi-special') specialCount++;
    });
  });
  
  return specialCount >= 3;
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
    isBonus: false // Removed bonus feature for simplicity
  };
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
