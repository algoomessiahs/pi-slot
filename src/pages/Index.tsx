
import React, { useEffect } from "react";
import SlotMachine from "@/components/SlotMachine";
import { GameProvider } from "@/components/GameContext";
import { initAudio } from "@/utils/soundUtils";
import { toast } from "sonner";
import { SYMBOLS } from "@/data/symbols";

const Index = () => {
  // Preload assets when component mounts
  useEffect(() => {
    // Initialize audio
    initAudio();
    
    // Preload images
    const preloadImages = async () => {
      console.log("Preloading all game images");
      
      // Preload symbol images
      SYMBOLS.forEach(symbol => {
        const img = new Image();
        img.src = symbol.image;
        img.onload = () => console.log(`Preloaded: ${symbol.image}`);
        img.onerror = () => console.error(`Failed to preload: ${symbol.image}`);
      });
      
      // Preload other game images
      const otherImages = [
        '/assets/images/pi-logo.png',
        '/assets/images/pi-pattern.png'
      ];
      
      otherImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log(`Preloaded: ${src}`);
        img.onerror = () => console.error(`Failed to preload: ${src}`);
      });
    };
    
    preloadImages();
    
    // Show welcome toast
    toast("Welcome to Pi Slots!", {
      description: "Spin to win Pi cryptocurrency rewards!",
      duration: 5000,
    });
  }, []);
  
  return (
    <GameProvider>
      <SlotMachine />
    </GameProvider>
  );
};

export default Index;
