
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SYMBOLS, getSymbolById } from "../data/symbols";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface PayTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayTable: React.FC<PayTableProps> = ({ open, onOpenChange }) => {
  // Filter and sort symbols by value (highest first for regular symbols, then special symbols)
  const regularSymbols = SYMBOLS.filter(symbol => !symbol.isSpecial).sort((a, b) => b.value - a.value);
  const specialSymbols = SYMBOLS.filter(symbol => symbol.isSpecial);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="candy-panel max-w-4xl mx-auto p-0 border-none max-h-[90vh] overflow-y-auto">
        <div className="relative candy-panel">
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
          
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Pi Slots - Pay Table</DialogTitle>
          </DialogHeader>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">How To Win</h3>
            <p className="mb-4">
              Match 3 identical symbols in a row, column, or diagonal to win. The more valuable the symbol, the higher the payout!
            </p>
            <p className="mb-2">
              <strong>House Edge:</strong> 5% (5% of bets also contribute to the jackpot pool)
            </p>
            <p className="mb-2">
              <strong>Minimum Bet:</strong> 0.5 Pi per line
            </p>
            <p className="mb-2">
              <strong>Maximum Bet:</strong> 10 Pi per line
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Regular Symbols</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {regularSymbols.map((symbol) => (
                <div key={symbol.id} className="flex flex-col items-center bg-white/30 backdrop-blur-sm rounded-xl p-3">
                  <div className="mb-2">
                    <div 
                      className="w-16 h-16 overflow-hidden rounded-full border-2 border-purple-500"
                      style={{
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={symbol.image} 
                        alt={symbol.name} 
                        className="absolute w-full"
                        style={{
                          top: `-${symbol.cropPosition?.top || 0}%`,
                          clipPath: `inset(${symbol.cropPosition?.top || 0}% 0 ${100 - (symbol.cropPosition?.top || 0) - (symbol.cropPosition?.height || 100)}% 0)`,
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold">{symbol.name}</h4>
                  <p className="text-center mt-1">
                    3 in a row: <span className="font-bold">× {symbol.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Special Symbols</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialSymbols.map((symbol) => (
                <div key={symbol.id} className="flex items-start bg-white/30 backdrop-blur-sm rounded-xl p-4">
                  <div className="mr-4">
                    <div 
                      className="w-14 h-14 overflow-hidden rounded-full border-2 border-yellow-500"
                      style={{
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={symbol.image} 
                        alt={symbol.name} 
                        className="absolute w-full"
                        style={{
                          top: `-${symbol.cropPosition?.top || 0}%`,
                          clipPath: `inset(${symbol.cropPosition?.top || 0}% 0 ${100 - (symbol.cropPosition?.top || 0) - (symbol.cropPosition?.height || 100)}% 0)`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{symbol.name}</h4>
                    {symbol.id === 'pi-314-alt' && (
                      <p>Wild symbol - substitutes for any regular symbol to complete winning combinations.</p>
                    )}
                    {symbol.id === 'pi-node-alt' && (
                      <p>Scatter symbol - 2 or more anywhere on the reels award free spins! 2 scatters = 1 free spin, 3 scatters = 5 free spins.</p>
                    )}
                    {symbol.id === 'pi-special' && (
                      <p>Jackpot symbol - 3 Jackpot symbols in a row award the progressive jackpot!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Paylines</h3>
            <p className="mb-4">
              This game has 8 possible paylines. You can select how many lines to play (1-8). 
              More lines means more chances to win, but also increases your total bet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-bold mb-2">What are paylines?</h4>
                <p>Paylines include horizontal rows, diagonals, and special patterns where matching symbols must land to create a win.</p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-bold mb-2">How is my bet calculated?</h4>
                <p>Total Bet = Bet per Line × Number of Lines</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayTable;
