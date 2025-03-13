
import React, { useEffect } from "react";
import SlotMachine from "@/components/SlotMachine";
import { GameProvider } from "@/context/GameProvider";
import { initAudio } from "@/utils/soundUtils";
import { toast } from "sonner";
import { SYMBOLS } from "@/data/symbols";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
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
      description: user ? `Signed in as ${user.email}` : "Sign in to save your progress and winnings!",
      duration: 5000,
    });
  }, [user]);
  
  return (
    <GameProvider>
      <SlotMachine />
    </GameProvider>
  );
};

export default Index;
