
// Sound effect utility functions for the slot machine

// Sound URLs
const SOUNDS = {
  spin: '/assets/sounds/spin.mp3',
  win: '/assets/sounds/win.mp3',
  bigWin: '/assets/sounds/big-win.mp3',
  jackpot: '/assets/sounds/jackpot.mp3',
  buttonClick: '/assets/sounds/click.mp3',
  coinDrop: '/assets/sounds/coin-drop.mp3',
};

// Audio context singleton
let audioContext: AudioContext | null = null;

// Sound cache to avoid reloading
const soundCache = new Map<string, AudioBuffer>();

// Initialize audio context (must be triggered by user interaction)
export const initAudio = (): void => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
};

// Load a sound file
const loadSound = async (url: string): Promise<AudioBuffer> => {
  if (!audioContext) initAudio();
  
  // Check cache first
  if (soundCache.has(url)) {
    return soundCache.get(url)!;
  }
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
    soundCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Failed to load sound:', error);
    throw error;
  }
};

// Play a sound with optional volume control
export const playSound = async (sound: keyof typeof SOUNDS, volume = 1): Promise<void> => {
  if (!audioContext) initAudio();
  
  try {
    const audioBuffer = await loadSound(SOUNDS[sound]);
    const source = audioContext!.createBufferSource();
    const gainNode = audioContext!.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext!.destination);
    
    source.start();
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

// Mute/unmute all sounds
let isMuted = false;

export const toggleMute = (): boolean => {
  isMuted = !isMuted;
  return isMuted;
};

export const isSoundMuted = (): boolean => {
  return isMuted;
};

// Wrapper function that checks mute state before playing
export const playSoundIfEnabled = async (sound: keyof typeof SOUNDS, volume = 1): Promise<void> => {
  if (!isMuted) {
    await playSound(sound, volume);
  }
};
