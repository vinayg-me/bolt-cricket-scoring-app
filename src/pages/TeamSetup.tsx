import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Users, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useGameStore from '../store';

const TeamSetup: React.FC = () => {
  const navigate = useNavigate();
  const { gameMode, createTeam } = useGameStore();
  const [team1Name, setTeam1Name] = useState(gameMode === 'express' ? 'Team 1' : '');
  const [team2Name, setTeam2Name] = useState(gameMode === 'express' ? 'Team 2' : '');
  const [playerCount, setPlayerCount] = useState<number>(11);
  const [errors, setErrors] = useState<{team1?: string; team2?: string; players?: string}>({});
  
  const validateForm = () => {
    const newErrors: {team1?: string; team2?: string; players?: string} = {};
    
    if (gameMode === 'custom') {
      if (!team1Name.trim()) {
        newErrors.team1 = 'Team 1 name is required';
      }
      
      if (!team2Name.trim()) {
        newErrors.team2 = 'Team 2 name is required';
      }
    }
    
    if (playerCount < 2) {
      newErrors.players = 'Minimum 2 players required';
    }
    
    if (playerCount > 11) {
      newErrors.players = 'Maximum 11 players allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    if (validateForm()) {
      // Create teams
      createTeam(team1Name || 'Team 1', playerCount);
      createTeam(team2Name || 'Team 2', playerCount);
      
      // Navigate to next step
      navigate('/game-setup');
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Team Setup
      </motion.h1>
      
      <Card animate>
        <div className="space-y-5">
          {gameMode === 'custom' && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-primary" />
                  Team Names
                </h2>
                <Input
                  label="Team 1 Name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Enter team 1 name"
                  fullWidth
                  error={errors.team1}
                />
                
                <Input
                  label="Team 2 Name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Enter team 2 name"
                  fullWidth
                  error={errors.team2}
                />
              </div>
              
              <div className="border-t border-surface-light my-5 pt-5">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <PlusCircle size={20} className="mr-2 text-primary" />
                  Team Size
                </h2>
              </div>
            </>
          )}
          
          {gameMode === 'express' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PlusCircle size={20} className="mr-2 text-primary" />
                Number of Players
              </h2>
            </div>
          )}
          
          <div className="flex items-center">
            <Button
              onClick={() => setPlayerCount(prev => Math.max(2, prev - 1))}
              variant="outline"
              className="px-3"
              aria-label="Decrease player count"
            >
              <Trash2 size={18} />
            </Button>
            
            <div className="mx-4 text-center flex-1">
              <div className="text-4xl font-bold text-primary">
                {playerCount}
              </div>
              <div className="text-sm text-white/60">
                Players per team
              </div>
              {errors.players && (
                <p className="text-error text-sm mt-1">{errors.players}</p>
              )}
            </div>
            
            <Button
              onClick={() => setPlayerCount(prev => Math.min(11, prev + 1))}
              variant="outline"
              className="px-3"
              aria-label="Increase player count"
            >
              <PlusCircle size={18} />
            </Button>
          </div>
          
          <Button 
            onClick={handleContinue}
            variant="primary"
            fullWidth
            className="mt-6"
          >
            Continue
          </Button>
        </div>
      </Card>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-center mt-6"
      >
        {gameMode === 'express' 
          ? 'Players will have generic names (Player 1, Player 2, etc.)' 
          : 'Next, you\'ll set up specific player details'
        }
      </motion.p>
    </div>
  );
};

export default TeamSetup;