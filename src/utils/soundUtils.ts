
// Sound effect utility functions for the slot machine

// Sound URLs
const SOUNDS = {
  spin: '/assets/sounds/spin.mp3',
  win: '/assets/sounds/big-win.mp3',
  bigWin: '/assets/sounds/big-win.mp3',
  jackpot: '/assets/sounds/jackpot.mp3',
  buttonClick: '/assets/sounds/click.mp3',
  coinDrop: '/assets/sounds/coin-drop.mp3',
};

// Audio context singleton
let audioContext: AudioContext | null = null;

// Sound cache to avoid reloading
const soundCache = new Map<string, AudioBuffer>();

// Currently playing sounds
const activeSounds = new Map<string, AudioBufferSourceNode>();

// Initialize audio context (must be triggered by user interaction)
export const initAudio = (): void => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("Audio context initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
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
    console.log(`Loading sound: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
    soundCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Failed to load sound:', error);
    throw error;
  }
};

// Stop all currently playing sounds of a specific type
export const stopSound = (sound: keyof typeof SOUNDS): void => {
  if (activeSounds.has(sound)) {
    try {
      activeSounds.get(sound)?.stop();
      activeSounds.delete(sound);
      console.log(`Stopped sound: ${sound}`);
    } catch (error) {
      console.error(`Error stopping sound ${sound}:`, error);
    }
  }
};

// Stop all currently playing sounds
export const stopAllSounds = (): void => {
  activeSounds.forEach((source, sound) => {
    try {
      source.stop();
      console.log(`Stopped sound: ${sound}`);
    } catch (error) {
      console.error(`Error stopping sound ${sound}:`, error);
    }
  });
  activeSounds.clear();
};

// Categorize sounds by group (win sounds, UI sounds, etc.)
const SOUND_GROUPS = {
  winSounds: ['win', 'bigWin', 'jackpot'],
  uiSounds: ['buttonClick', 'coinDrop'],
  gameSounds: ['spin']
};

// Play a sound with optional volume control
export const playSound = async (sound: keyof typeof SOUNDS, volume = 1, loop = false): Promise<void> => {
  if (!audioContext) initAudio();
  
  try {
    console.log(`Attempting to play sound: ${sound}`);
    
    // Stop sounds in the same group
    for (const [groupName, sounds] of Object.entries(SOUND_GROUPS)) {
      if (sounds.includes(sound)) {
        // Stop all sounds in this group
        for (const groupSound of sounds) {
          if (groupSound !== sound) {
            stopSound(groupSound as keyof typeof SOUNDS);
          }
        }
        break;
      }
    }
    
    // If this specific sound is already playing, stop it
    stopSound(sound);
    
    const audioBuffer = await loadSound(SOUNDS[sound]);
    const source = audioContext!.createBufferSource();
    const gainNode = audioContext!.createGain();
    
    source.buffer = audioBuffer;
    source.loop = loop;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext!.destination);
    
    // Track the source for potential stopping later
    activeSounds.set(sound, source);
    
    // Remove from active sounds when it ends naturally
    source.onended = () => {
      activeSounds.delete(sound);
      console.log(`Sound ended naturally: ${sound}`);
    };
    
    source.start();
    console.log(`Sound played: ${sound}`);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

// Mute/unmute all sounds
let isMuted = false;

export const toggleMute = (): boolean => {
  isMuted = !isMuted;
  
  if (isMuted) {
    stopAllSounds();
  }
  
  console.log(`Sound is now ${isMuted ? 'muted' : 'unmuted'}`);
  return isMuted;
};

export const isSoundMuted = (): boolean => {
  return isMuted;
};

// Wrapper function that checks mute state before playing
export const playSoundIfEnabled = async (sound: keyof typeof SOUNDS, volume = 1, loop = false): Promise<void> => {
  if (!isMuted) {
    await playSound(sound, volume, loop);
  } else {
    console.log(`Sound ${sound} not played because audio is muted`);
  }
};
