
import { Symbol } from '../types/game';

export const SYMBOLS: Symbol[] = [
  {
    id: 'donut-white',
    name: 'Pi Logo',
    image: '/assets/images/symbols/pi-logo.png',
    value: 50,
    isSpecial: false,
  },
  {
    id: 'donut-yellow',
    name: 'Pi Coin Gold',
    image: '/assets/images/symbols/pi-coin-gold.png',
    value: 60,
    isSpecial: false,
  },
  {
    id: 'donut-pink',
    name: 'Pi Coin Silver',
    image: '/assets/images/symbols/pi-coin-silver.png',
    value: 70,
    isSpecial: false,
  },
  {
    id: 'donut-red',
    name: 'Pi App',
    image: '/assets/images/symbols/pi-app.png',
    value: 80,
    isSpecial: false,
  },
  {
    id: 'donut-purple',
    name: 'Pioneer',
    image: '/assets/images/symbols/pioneer.png',
    value: 90,
    isSpecial: false,
  },
  {
    id: 'donut-brown',
    name: 'Pi Wallet',
    image: '/assets/images/symbols/pi-wallet.png',
    value: 100,
    isSpecial: false,
  },
  {
    id: 'letter-a',
    name: 'Letter A',
    image: '/assets/images/symbols/letter-a.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-n',
    name: 'Letter P',
    image: '/assets/images/symbols/letter-p.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-k',
    name: 'Letter I',
    image: '/assets/images/symbols/letter-i.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-l',
    name: 'Letter N',
    image: '/assets/images/symbols/letter-n.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-m',
    name: 'Letter W',
    image: '/assets/images/symbols/letter-w.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'special-wild',
    name: 'Wild',
    image: '/assets/images/symbols/wild.png',
    value: 200,
    isSpecial: true,
  },
  {
    id: 'special-scatter',
    name: 'Scatter',
    image: '/assets/images/symbols/scatter.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-free-spin',
    name: 'Free Spin',
    image: '/assets/images/symbols/free-spin.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-bonus',
    name: 'Bonus',
    image: '/assets/images/symbols/bonus.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-jackpot',
    name: 'Jackpot',
    image: '/assets/images/symbols/jackpot.png',
    value: 0,
    isSpecial: true,
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

export const PAY_LINES = [
  [0, 0, 0, 0, 0], // Middle row
  [1, 1, 1, 1, 1], // Top row
  [2, 2, 2, 2, 2], // Bottom row
  [0, 1, 2, 1, 0], // V shape
  [2, 1, 0, 1, 2], // Inverted V shape
  [0, 0, 1, 2, 2], // Diagonal from top left to bottom right
  [2, 2, 1, 0, 0], // Diagonal from bottom left to top right
  [1, 0, 0, 0, 1], // U shape
  [1, 2, 2, 2, 1], // Inverted U shape
  [0, 1, 1, 1, 0], // Small V shape
  [2, 1, 1, 1, 2], // Small inverted V shape
  [0, 0, 0, 1, 2], // Steps from top left
  [2, 2, 2, 1, 0], // Steps from bottom left
  [0, 1, 2, 2, 2], // Steps to bottom right
  [2, 1, 0, 0, 0], // Steps to top right
  [1, 1, 0, 1, 1], // W shape
  [1, 1, 2, 1, 1], // M shape
  [0, 2, 0, 2, 0], // Zigzag top-bottom
  [2, 0, 2, 0, 2], // Zigzag bottom-top
  [1, 0, 1, 0, 1]  // Zigzag middle-top
];

export const PAYLINE_COLORS = [
  '#FF4560', // Middle row - Red
  '#70C1FF', // Top row - Blue
  '#FFDB58', // Bottom row - Yellow
  '#B76EF0', // V shape - Purple
  '#50C878', // Inverted V shape - Green
  '#FF70B5', // Diagonal - Pink
  '#FFA07A', // Diagonal - Light Salmon
  '#00BFFF', // U shape - Deep Sky Blue
  '#9370DB', // Inverted U shape - Medium Purple
  '#FF6347', // Small V shape - Tomato
  '#3CB371', // Small inverted V shape - Medium Sea Green
  '#FFD700', // Steps - Gold
  '#FF1493', // Steps - Deep Pink
  '#00FA9A', // Steps - Medium Spring Green
  '#FF00FF', // Steps - Magenta
  '#1E90FF', // W shape - Dodger Blue
  '#FF8C00', // M shape - Dark Orange
  '#8A2BE2', // Zigzag - Blue Violet
  '#20B2AA', // Zigzag - Light Sea Green
  '#FF4500'  // Zigzag - Orange Red
];
