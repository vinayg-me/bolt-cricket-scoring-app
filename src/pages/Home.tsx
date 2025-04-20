import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket as Cricket, Play, Settings } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useGameStore from '../store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hasExistingMatch, setHasExistingMatch] = useState(false);
  const { currentMatch } = useGameStore();
  
  useEffect(() => {
    if (currentMatch && currentMatch.inProgress) {
      setHasExistingMatch(true);
    }
  }, [currentMatch]);
  
  const handleNewMatch = () => {
    navigate('/mode-selection');
  };
  
  const handleContinueMatch = () => {
    navigate('/scoring');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="mb-8"
      >
        <Cricket size={80} className="text-primary" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-4 text-center"
      >
        Cricket Scorer
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/70 mb-8 text-center max-w-md"
      >
        Score your cricket matches with ease and precision
      </motion.p>
      
      <div className="w-full max-w-md space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            onClick={handleNewMatch}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play size={20} />}
          >
            New Match
          </Button>
        </motion.div>
        
        {hasExistingMatch && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              onClick={handleContinueMatch}
              variant="outline"
              size="lg"
              fullWidth
              icon={<Settings size={20} />}
            >
              Continue Match
            </Button>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 w-full max-w-md"
      >
        <Card className="text-center">
          <h2 className="text-xl font-semibold mb-2">About Cricket Scorer</h2>
          <p className="text-white/70">
            Record ball-by-ball action, track player statistics, and share match results easily.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;