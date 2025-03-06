
import { Symbol } from '../types/game';

export const SYMBOLS: Symbol[] = [
  {
    id: 'pi-logo',
    name: 'Pi Logo',
    image: '/assets/images/symbols/pi-logo.png',
    value: 50,
    isSpecial: false,
    cropPosition: { top: 0, height: 11.11 } // First symbol (0-11.11%)
  },
  {
    id: 'pi-symbol',
    name: 'Pi Symbol',
    image: '/assets/images/symbols/pi-logo.png',
    value: 40,
    isSpecial: false,
    cropPosition: { top: 11.11, height: 11.11 } // Second symbol (11.11-22.22%)
  },
  {
    id: 'pi-314',
    name: '3.14',
    image: '/assets/images/symbols/3.14.png',
    value: 30,
    isSpecial: false,
    cropPosition: { top: 22.22, height: 11.11 } // Third symbol (22.22-33.33%)
  },
  {
    id: 'pi-bcv',
    name: 'BCV',
    image: '/assets/images/symbols/gcv.png',
    value: 25,
    isSpecial: false,
    cropPosition: { top: 33.33, height: 11.11 } // Fourth symbol (33.33-44.44%)
  },
  {
    id: 'pi-node',
    name: 'Pi Node',
    image: '/assets/images/symbols/pi-coin.png',
    value: 20,
    isSpecial: false,
    cropPosition: { top: 44.44, height: 11.11 } // Fifth symbol (44.44-55.55%)
  },
  {
    id: 'pi-314-alt',
    name: '3.14 Alt',
    image: '/assets/images/symbols/3.14.png',
    value: 15,
    isSpecial: true,
    cropPosition: { top: 55.55, height: 11.11 } // Sixth symbol (55.55-66.66%)
  },
  {
    id: 'pi-symbol-alt',
    name: 'Pi Symbol Alt',
    image: '/assets/images/symbols/pi-logo.png',
    value: 10,
    isSpecial: false,
    cropPosition: { top: 66.66, height: 11.11 } // Seventh symbol (66.66-77.77%)
  },
  {
    id: 'pi-node-alt',
    name: 'Pi Node Alt',
    image: '/assets/images/symbols/pi-coin.png',
    value: 5,
    isSpecial: true,
    cropPosition: { top: 77.77, height: 11.11 } // Eighth symbol (77.77-88.88%)
  },
  {
    id: 'pi-special',
    name: 'Pi Special',
    image: '/assets/images/symbols/Jackpot.png',
    value: 100,
    isSpecial: true,
    cropPosition: { top: 88.88, height: 11.11 } // Ninth symbol (88.88-100%)
  }
];

// House edge calculation for game profitability
// This makes payouts slightly less than true odds
export const HOUSE_EDGE = 0.05; // 5% house edge

export const getSymbolById = (id: string): Symbol => {
  const symbol = SYMBOLS.find(symbol => symbol.id === id);
  if (!symbol) {
    throw new Error(`Symbol with id ${id} not found`);
  }
  return symbol;
};

// Update pay lines for 3x3 grid (8 possible winning patterns)
export const PAY_LINES = [
  [0, 0, 0], // Top row
  [1, 1, 1], // Middle row
  [2, 2, 2], // Bottom row
  [0, 1, 2], // Diagonal from top left to bottom right
  [2, 1, 0], // Diagonal from bottom left to top right
  [0, 0, 1], // Top row with bend
  [1, 0, 0], // Middle to top
  [1, 2, 2]  // Middle to bottom
];

export const PAYLINE_COLORS = [
  '#FF4560', // Top row - Red
  '#70C1FF', // Middle row - Blue
  '#FFDB58', // Bottom row - Yellow
  '#B76EF0', // Diagonal - Purple
  '#50C878', // Diagonal - Green
  '#FF70B5', // Top row with bend - Pink
  '#FFA07A', // Middle to top - Light Salmon
  '#00BFFF'  // Middle to bottom - Deep Sky Blue
];
