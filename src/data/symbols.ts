
import { Symbol } from '../types/game';

export const SYMBOLS: Symbol[] = [
  {
    id: 'donut-white',
    name: 'White Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 50,
    isSpecial: false,
  },
  {
    id: 'donut-yellow',
    name: 'Yellow Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 60,
    isSpecial: false,
  },
  {
    id: 'donut-pink',
    name: 'Pink Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 70,
    isSpecial: false,
  },
  {
    id: 'donut-red',
    name: 'Red Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 80,
    isSpecial: false,
  },
  {
    id: 'donut-purple',
    name: 'Purple Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 90,
    isSpecial: false,
  },
  {
    id: 'donut-brown',
    name: 'Brown Donut',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 100,
    isSpecial: false,
  },
  {
    id: 'letter-a',
    name: 'Letter A',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-n',
    name: 'Letter N',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-k',
    name: 'Letter K',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-l',
    name: 'Letter L',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'letter-m',
    name: 'Letter M',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 20,
    isSpecial: false,
  },
  {
    id: 'special-wild',
    name: 'Wild',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 200,
    isSpecial: true,
  },
  {
    id: 'special-scatter',
    name: 'Scatter',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-free-spin',
    name: 'Free Spin',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-bonus',
    name: 'Bonus',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
    value: 0,
    isSpecial: true,
  },
  {
    id: 'special-jackpot',
    name: 'Jackpot',
    image: '/public/lovable-uploads/6a9de6ea-3ea5-4998-b5d7-fb162a643220.png',
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
