import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Users2, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import useGameStore from '../store';
import { PlayerRole } from '../types';

const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const { gameMode, currentMatch, createMatch, updatePlayer } = useGameStore();
  const [overs, setOvers] = useState<number>(20);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);
  const [errors, setErrors] = useState<{overs?: string; players?: string}>({});
  
  // For custom mode player setup
  const [, setPlayerSetup] = useState<{
    name: string;
    role: PlayerRole;
  }>({
    name: '',
    role: 'Batsman'
  });
  
  useEffect(() => {
    if (!currentMatch) {
      navigate('/team-setup');
    }
  }, [currentMatch, navigate]);
  
  if (!currentMatch) {
    return null;
  }
  
  const activeTeam = currentMatch.teams[activeTeamIndex];
  
  const validateGameSettings = () => {
    const newErrors: {overs?: string; players?: string} = {};
    
    if (overs < 1) {
      newErrors.overs = 'Minimum 1 over required';
    }
    
    if (overs > 50) {
      newErrors.overs = 'Maximum 50 overs allowed';
    }
    
    // If in custom mode, check that all players have names
    if (gameMode === 'custom') {
      const allPlayersHaveNames = currentMatch.teams.every(
        team => team.players.every(player => player.name.trim() !== '')
      );
      
      if (!allPlayersHaveNames) {
        newErrors.players = 'All players must have names';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleStartMatch = () => {
    if (validateGameSettings()) {
      createMatch(currentMatch.teams, overs);
      navigate('/coin-toss');
    }
  };
  
  const handleSwitchTeam = () => {
    setActiveTeamIndex(prev => prev === 0 ? 1 : 0);
    setPlayerSetup({
      name: '',
      role: 'Batsman'
    });
  };
  
  const handlePlayerNameChange = (index: number, name: string) => {
    if (!activeTeam) return;
    
    const player = activeTeam.players[index];
    if (!player) return;
    
    updatePlayer({
      ...player,
      name
    });
  };
  
  const handlePlayerRoleChange = (index: number, role: PlayerRole) => {
    if (!activeTeam) return;
    
    const player = activeTeam.players[index];
    if (!player) return;
    
    updatePlayer({
      ...player,
      role
    });
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Game Setup
      </motion.h1>
      
      <Card animate>
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Timer size={20} className="mr-2 text-primary" />
              Match Details
            </h2>
            
            <Input
              label="Number of Overs"
              type="number"
              value={overs.toString()}
              onChange={(e) => setOvers(parseInt(e.target.value) || 0)}
              min={1}
              max={50}
              fullWidth
              error={errors.overs}
            />
          </div>
          
          {gameMode === 'custom' && (
            <div className="border-t border-surface-light my-5 pt-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users2 size={20} className="mr-2 text-primary" />
                  {activeTeam?.name} Players
                </h2>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSwitchTeam}
                >
                  Switch to {currentMatch.teams[activeTeamIndex === 0 ? 1 : 0]?.name}
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {activeTeam?.players.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder={`Player ${index + 1} name`}
                        value={player.name}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        fullWidth
                        leftIcon={<User size={16} />}
                      />
                    </div>
                    
                    <div className="w-40">
                      <Select
                        options={[
                          { value: 'Batsman', label: 'Batsman' },
                          { value: 'Bowler', label: 'Bowler' },
                          { value: 'All Rounder', label: 'All Rounder' },
                          { value: 'Keeper', label: 'Keeper' }
                        ]}
                        value={player.role}
                        onChange={(value) => handlePlayerRoleChange(index, value as PlayerRole)}
                        fullWidth
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.players && (
                <p className="text-error text-sm mt-2">{errors.players}</p>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleStartMatch}
            variant="primary"
            fullWidth
            className="mt-6"
          >
            Start Match
          </Button>
        </div>
      </Card>
      
      {gameMode === 'express' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-center mt-6"
        >
          Players will be automatically set up with generic names
        </motion.p>
      )}
    </div>
  );
};

export default GameSetup;