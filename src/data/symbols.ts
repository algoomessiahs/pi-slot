
import { Symbol } from '../types/game';

export const SYMBOLS: Symbol[] = [
  {
    id: 'pi-logo',
    name: 'Pi Logo',
    image: '/assets/images/symbols/banana.png',
    value: 50,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-symbol',
    name: 'Pi Symbol',
    image: '/assets/images/symbols/bar.png',
    value: 40,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-314',
    name: '3.14',
    image: '/assets/images/symbols/bell.png',
    value: 30,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-bcv',
    name: 'BCV',
    image: '/assets/images/symbols/cherry.png',
    value: 25,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-node',
    name: 'Pi Node',
    image: '/assets/images/symbols/lemon.png',
    value: 20,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-314-alt',
    name: '3.14 Alt',
    image: '/assets/images/symbols/melon.png',
    value: 15,
    isSpecial: true,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-symbol-alt',
    name: 'Pi Symbol Alt',
    image: '/assets/images/symbols/orange.png',
    value: 10,
    isSpecial: false,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-node-alt',
    name: 'Pi Node Alt',
    image: '/assets/images/symbols/plum.png',
    value: 5,
    isSpecial: true,
    cropPosition: { top: 0, height: 100 }
  },
  {
    id: 'pi-special',
    name: 'Pi Special',
    image: '/assets/images/symbols/seven.png',
    value: 100,
    isSpecial: true,
    cropPosition: { top: 0, height: 100 }
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
