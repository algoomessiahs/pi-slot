
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
              Match 3 or more identical symbols on a payline from left to right to win. 
              The more matching symbols, the higher the payout!
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Regular Symbols</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">3 Symbols</TableHead>
                  <TableHead className="text-right">4 Symbols</TableHead>
                  <TableHead className="text-right">5 Symbols</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularSymbols.map((symbol) => (
                  <TableRow key={symbol.id}>
                    <TableCell>
                      <img 
                        src={symbol.image} 
                        alt={symbol.name} 
                        className="w-10 h-10 object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{symbol.name}</TableCell>
                    <TableCell className="text-right">{symbol.value * 3}</TableCell>
                    <TableCell className="text-right">{symbol.value * 10}</TableCell>
                    <TableCell className="text-right">{symbol.value * 50}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Special Symbols</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialSymbols.map((symbol) => (
                <div key={symbol.id} className="flex items-start bg-white/30 backdrop-blur-sm rounded-xl p-4">
                  <div className="mr-4">
                    <img 
                      src={symbol.image} 
                      alt={symbol.name} 
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{symbol.name}</h4>
                    {symbol.id === 'special-wild' && (
                      <p>Substitutes for any regular symbol to complete winning combinations.</p>
                    )}
                    {symbol.id === 'special-scatter' && (
                      <p>3 or more Scatter symbols anywhere on the reels award 10 free spins.</p>
                    )}
                    {symbol.id === 'special-free-spin' && (
                      <p>3 or more Free Spin symbols award additional free spins.</p>
                    )}
                    {symbol.id === 'special-bonus' && (
                      <p>3 or more Bonus symbols trigger the bonus game.</p>
                    )}
                    {symbol.id === 'special-jackpot' && (
                      <p>5 Jackpot symbols on a payline award the progressive jackpot!</p>
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
              This game has 20 possible paylines. You can select how many lines to play (1-20). 
              More lines means more chances to win, but also increases your total bet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-bold mb-2">What are paylines?</h4>
                <p>Paylines are the patterns across the reels where matching symbols must land to create a win.</p>
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
