
// Sound effects manager for the slot machine game
let soundEnabled = true;

// Preload all sounds for better performance
const SOUNDS = {
  spin: new Audio('/assets/sounds/spin.mp3'),
  win: new Audio('/assets/sounds/win.mp3'),
  jackpot: new Audio('/assets/sounds/jackpot.mp3'),
  click: new Audio('/assets/sounds/click.mp3'),
  coinInsert: new Audio('/assets/sounds/coin.mp3'),
  menuOpen: new Audio('/assets/sounds/menu.mp3'),
  buttonHover: new Audio('/assets/sounds/hover.mp3'),
  freeSpins: new Audio('/assets/sounds/freespin.mp3'),
};

// Configure all sounds
Object.values(SOUNDS).forEach(sound => {
  sound.volume = 0.5;
});

// Special settings for certain sounds
SOUNDS.jackpot.volume = 0.7;
SOUNDS.win.volume = 0.6;

/**
 * Play a sound effect if sound is enabled
 */
export const playSound = (soundName: keyof typeof SOUNDS): void => {
  if (!soundEnabled) return;
  
  const sound = SOUNDS[soundName];
  
  // Stop and reset the sound first to allow for rapid succession playback
  sound.pause();
  sound.currentTime = 0;
  
  // Play the sound
  sound.play().catch(err => {
    console.error('Error playing sound:', err);
    // Most browsers require user interaction before playing audio
  });
};

/**
 * Toggle sound on/off
 */
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

/**
 * Get current sound state
 */
export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

/**
 * Initialize sound system
 */
export const initSounds = (): void => {
  // Preload sounds
  Object.values(SOUNDS).forEach(sound => {
    sound.load();
  });
};
