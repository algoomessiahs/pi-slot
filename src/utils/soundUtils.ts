
let audioContext: AudioContext | null = null;
let isAudioInitialized = false;
let isMuted = false; // Track mute state

// Initialize audio context on user interaction
export const initAudio = () => {
  if (!isAudioInitialized) {
    try {
      window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContext();
      isAudioInitialized = true;
      console.log('Audio context initialized');
    } catch (e) {
      console.error('Web Audio API is not supported in this browser', e);
    }
  }
};

// Get audio context
export const getAudioContext = () => {
  if (!isAudioInitialized) {
    console.warn('Audio context not initialized. Please call initAudio() first.');
    return null;
  }
  return audioContext;
};

// Toggle mute state and return new state
export const toggleMute = (): boolean => {
  isMuted = !isMuted;
  if (isMuted) {
    stopAllSounds();
  }
  return isMuted;
};

// Check if sound is currently muted
export const isSoundMuted = (): boolean => {
  return isMuted;
};

// Get sound URL
const getSoundUrl = (soundName: string): string | null => {
  switch (soundName) {
    case 'spin':
      return '/assets/sounds/spin.mp3';
    case 'win':
      return '/assets/sounds/win.mp3';
    case 'bigWin':
      return '/assets/sounds/big-win.mp3';
    case 'jackpot':
      return '/assets/sounds/jackpot.mp3';
    case 'buttonClick':
      return '/assets/sounds/button-click.mp3';
    default:
      console.warn(`Sound not found: ${soundName}`);
      return null;
  }
};

// Add a map to track active sounds
const activeSounds: Map<string, HTMLAudioElement> = new Map();

// Clear a specific sound
export const stopSound = (soundName: string) => {
  const sound = activeSounds.get(soundName);
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(soundName);
  }
};

// Clear all active sounds
export const stopAllSounds = () => {
  activeSounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
  activeSounds.clear();
};

// Play sound if enabled
export const playSoundIfEnabled = (soundName: string, volume = 1.0) => {
  // Don't play sounds if muted
  if (isMuted) {
    return;
  }
  
  // First stop any existing instance of this sound to prevent overlap
  stopSound(soundName);
  
  const audioContext = getAudioContext();
  if (!audioContext) {
    console.warn('Audio context not initialized');
    return;
  }

  const soundUrl = getSoundUrl(soundName);
  if (!soundUrl) {
    console.warn(`Sound not found: ${soundName}`);
    return;
  }

  const audio = new Audio(soundUrl);
  audio.volume = volume;
  
  // Store the sound in our active sounds map
  activeSounds.set(soundName, audio);
  
  audio.play().catch(error => {
    console.error(`Error playing sound ${soundName}:`, error);
    activeSounds.delete(soundName);
  });
  
  // Remove from active sounds when done playing
  audio.onended = () => {
    activeSounds.delete(soundName);
  };
};
