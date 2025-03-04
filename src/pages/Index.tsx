
import React from "react";
import SlotMachine from "@/components/SlotMachine";
import { GameProvider } from "@/components/GameContext";

const Index = () => {
  return (
    <GameProvider>
      <SlotMachine />
    </GameProvider>
  );
};

export default Index;
