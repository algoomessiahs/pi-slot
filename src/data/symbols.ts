
import { Symbol } from '../types/game';

export const SYMBOLS: Symbol[] = [
  {
    id: 'donut-white',
    name: 'Pi Coin',
    image: '/assets/images/symbols/pi-coin.png',
    value: 50,
    isSpecial: false,
  },
  {
    id: 'donut-yellow',
    name: 'Pioneer',
    image: '/assets/images/symbols/pioneer.png',
    value: 60,
    isSpecial: false,
  },
  {
    id: 'donut-pink',
    name: 'Pi Browser',
    image: '/assets/images/symbols/pi-browser.png',
    value: 70,
    isSpecial: false,
  },
  {
    id: 'donut-red',
    name: 'Pi Wallet',
    image: '/assets/images/symbols/pi-wallet.png',
    value: 80,
    isSpecial: false,
  },
  {
    id: 'donut-purple',
    name: 'Pi App',
    image: '/assets/images/symbols/pi-app.png',
    value: 90,
    isSpecial: false,
  },
  {
    id: 'donut-brown',
    name: 'Pi Node',
    image: '/assets/images/symbols/pi-node.png',
    value: 100,
    isSpecial: false,
  },
  {
    id: 'letter-a',
    name: 'Blockchain',
    image: '/assets/images/symbols/blockchain.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-n',
    name: 'Mining',
    image: '/assets/images/symbols/mining.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-k',
    name: 'Exchange',
    image: '/assets/images/symbols/exchange.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-l',
    name: 'Security',
    image: '/assets/images/symbols/security.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-m',
    name: 'Wallet',
    image: '/assets/images/symbols/wallet.png',
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
