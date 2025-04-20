import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useGameStore from '../store';

const CoinToss: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, setTossResult } = useGameStore();
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [choice, setChoice] = useState<'bat' | 'bowl' | null>(null);
  
  if (!currentMatch) {
    navigate('/mode-selection');
    return null;
  }
  
  const team1 = currentMatch.teams[0];
  const team2 = currentMatch.teams[1];
  
  const handleFlip = () => {
    setFlipping(true);
    
    // Simulate coin toss
    setTimeout(() => {
      const tossResult = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(tossResult);
      setFlipping(false);
      
      // Auto-select winner based on heads/tails
      if (tossResult === 'heads') {
        setSelectedTeam(team1.id);
      } else {
        setSelectedTeam(team2.id);
      }
    }, 2000);
  };
  
  const handleChoiceSelection = (selected: 'bat' | 'bowl') => {
    setChoice(selected);
  };
  
  const handleContinue = () => {
    if (selectedTeam && choice) {
      setTossResult(selectedTeam, choice);
      navigate('/player-selection');
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Coin Toss
      </motion.h1>
      
      <Card animate>
        <div className="text-center">
          <div className="h-48 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              {!result && !flipping && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-primary/20 p-10 rounded-full">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">Toss</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {flipping && (
                <motion.div
                  key="flipping"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 1080 }}
                  transition={{ duration: 2 }}
                >
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">?</span>
                  </div>
                </motion.div>
              )}
              
              {result && !flipping && (
                <motion.div
                  key="result"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-bold capitalize">{result}</span>
                    </div>
                    
                    <p className="text-lg font-medium">
                      {result === 'heads' ? team1.name : team2.name} wins the toss!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {!result && !flipping && (
            <Button 
              onClick={handleFlip} 
              variant="primary"
              size="lg"
            >
              Flip Coin
            </Button>
          )}
          
          {result && !flipping && !choice && (
            <div className="mt-6">
              <p className="mb-4 text-white/70">
                What does {result === 'heads' ? team1.name : team2.name} choose to do?
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleChoiceSelection('bat')} 
                  variant="secondary"
                >
                  Bat
                </Button>
                
                <Button 
                  onClick={() => handleChoiceSelection('bowl')} 
                  variant="accent"
                >
                  Bowl
                </Button>
              </div>
            </div>
          )}
          
          {result && choice && (
            <div className="mt-6">
              <p className="mb-4 text-lg">
                {result === 'heads' ? team1.name : team2.name} has chosen to {choice} first
              </p>
              
              <Button 
                onClick={handleContinue} 
                variant="primary"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CoinToss;