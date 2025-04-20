import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sliders } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useGameStore from '../store';

const ModeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setGameMode } = useGameStore();
  
  const handleModeSelect = (mode: 'express' | 'custom') => {
    setGameMode(mode);
    navigate('/team-setup');
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Select Mode
      </motion.h1>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="hover:shadow-glow cursor-pointer transition-all"
            onClick={() => handleModeSelect('express')}
          >
            <div className="flex items-center">
              <div className="bg-accent/20 p-4 rounded-full mr-4">
                <Zap size={30} className="text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Express Mode</h2>
                <p className="text-white/70">
                  Quick setup with auto-generated teams and players. Perfect for casual matches.
                </p>
              </div>
            </div>
            <Button 
              className="mt-4 w-full"
              variant="accent"
            >
              Select Express Mode
            </Button>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            className="hover:shadow-glow cursor-pointer transition-all"
            onClick={() => handleModeSelect('custom')}
          >
            <div className="flex items-center">
              <div className="bg-secondary/20 p-4 rounded-full mr-4">
                <Sliders size={30} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Custom Mode</h2>
                <p className="text-white/70">
                  Full control with custom team names, player details, and roles.
                </p>
              </div>
            </div>
            <Button 
              className="mt-4 w-full"
              variant="secondary"
            >
              Select Custom Mode
            </Button>
          </Card>
        </motion.div>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-center mt-8"
      >
        Choose a mode that fits your scoring needs
      </motion.p>
    </div>
  );
};

export default ModeSelection;