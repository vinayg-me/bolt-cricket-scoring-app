import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Bath as Bat, Ticket as Cricket } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useGameStore from '../store';
import { formatOvers, calculateRunRate } from '../utils/helpers';

type Tab = 'batting' | 'bowling';

const Scorecard: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch } = useGameStore();
  const [activeInnings, setActiveInnings] = useState<number>(currentMatch?.currentInnings || 0);
  const [activeTab, setActiveTab] = useState<Tab>('batting');
  
  const navigate1 = useNavigate();
  
  if (!currentMatch) {
    navigate('/');
    return null;
  }
  
  const innings = currentMatch.innings[activeInnings];
  if (!innings) {
    navigate('/');
    return null;
  }
  
  const battingTeam = currentMatch.teams.find(team => team.id === innings.battingTeam);
  const bowlingTeam = currentMatch.teams.find(team => team.id === innings.bowlingTeam);
  
  if (!battingTeam || !bowlingTeam) {
    navigate('/');
    return null;
  }
  
  const totalOvers = formatOvers(
    innings.currentOver + (innings.currentBall > 0 ? innings.currentBall / 10 : 0)
  );
  
  const runRate = calculateRunRate(
    innings.totalRuns,
    innings.currentOver + (innings.currentBall > 0 ? innings.currentBall / 10 : 0)
  );
  
  const handleContinue = () => {
    navigate('/scoring');
  };
  
  // Match result determination
  let matchResult = '';
  if (!currentMatch.inProgress && currentMatch.innings.length === 2) {
    const firstInningsRuns = currentMatch.innings[0].totalRuns;
    const secondInningsRuns = currentMatch.innings[1].totalRuns;
    
    const firstInningsTeam = currentMatch.teams.find(t => t.id === currentMatch.innings[0].battingTeam);
    const secondInningsTeam = currentMatch.teams.find(t => t.id === currentMatch.innings[1].battingTeam);
    
    if (firstInningsRuns > secondInningsRuns) {
      const runDifference = firstInningsRuns - secondInningsRuns;
      matchResult = `${firstInningsTeam?.name} won by ${runDifference} ${runDifference === 1 ? 'run' : 'runs'}`;
    } else if (secondInningsRuns > firstInningsRuns) {
      const wicketsRemaining = secondInningsTeam?.players.length - 
        (currentMatch.innings[1].totalWickets) - 1;
      matchResult = `${secondInningsTeam?.name} won by ${wicketsRemaining} ${wicketsRemaining === 1 ? 'wicket' : 'wickets'}`;
    } else {
      matchResult = 'Match Tied';
    }
  }
  
  return (
    <div className="max-w-lg mx-auto pb-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Scorecard
      </motion.h1>
      
      {/* Innings Selector */}
      {currentMatch.innings.length > 1 && (
        <div className="flex mb-4 space-x-2">
          <button
            className={`flex-1 py-2 rounded-lg text-center ${
              activeInnings === 0 
                ? 'bg-primary text-white font-medium' 
                : 'bg-surface text-white/70'
            }`}
            onClick={() => setActiveInnings(0)}
          >
            {currentMatch.teams.find(t => t.id === currentMatch.innings[0].battingTeam)?.name}
          </button>
          
          <button
            className={`flex-1 py-2 rounded-lg text-center ${
              activeInnings === 1 
                ? 'bg-primary text-white font-medium' 
                : 'bg-surface text-white/70'
            }`}
            onClick={() => setActiveInnings(1)}
          >
            {currentMatch.teams.find(t => t.id === currentMatch.innings[1].battingTeam)?.name}
          </button>
        </div>
      )}
      
      {/* Score Summary */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{battingTeam.name}</h2>
            <div className="text-3xl font-bold flex items-baseline">
              {innings.totalRuns}/{innings.totalWickets}
              <span className="text-sm text-white/60 ml-2">
                ({totalOvers} overs)
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-base">Run Rate</div>
            <div className="text-2xl font-bold">{runRate}</div>
          </div>
        </div>
        
        <div className="flex space-x-3 mb-4">
          <div className="flex-1 bg-surface-light rounded-lg p-3">
            <div className="text-sm text-white/70">Extras</div>
            <div className="font-bold">
              {innings.extras.wides + innings.extras.noBalls + 
               innings.extras.byes + innings.extras.legByes + 
               innings.extras.penalty}
            </div>
          </div>
          
          <div className="flex-1 bg-surface-light rounded-lg p-3">
            <div className="text-sm text-white/70">Wides</div>
            <div className="font-bold">{innings.extras.wides}</div>
          </div>
          
          <div className="flex-1 bg-surface-light rounded-lg p-3">
            <div className="text-sm text-white/70">No Balls</div>
            <div className="font-bold">{innings.extras.noBalls}</div>
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
      <div className="flex mb-4 bg-surface rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'batting' 
              ? 'bg-primary text-white font-medium' 
              : 'bg-transparent text-white/70'
          }`}
          onClick={() => setActiveTab('batting')}
        >
          <span className="flex items-center justify-center">
            <Bat size={16} className="mr-2" />
            Batting
          </span>
        </button>
        
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'bowling' 
              ? 'bg-primary text-white font-medium' 
              : 'bg-transparent text-white/70'
          }`}
          onClick={() => setActiveTab('bowling')}
        >
          <span className="flex items-center justify-center">
            <Cricket size={16} className="mr-2" />
            Bowling
          </span>
        </button>
      </div>
      
      {/* Batting Scorecard */}
      {activeTab === 'batting' && (
        <Card>
          <h2 className="text-xl font-bold mb-3">Batting - {battingTeam.name}</h2>
          
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-light">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Batter
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    R
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    B
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    4s
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    6s
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    SR
                  </th>
                </tr>
              </thead>
              <tbody>
                {battingTeam.players.map((player) => {
                  const stats = player.batting || { 
                    runs: 0, balls: 0, fours: 0, sixes: 0, 
                    strikeRate: 0, isOut: false 
                  };
                  
                  const isCurrentlyBatting = 
                    player.id === innings.striker || 
                    player.id === innings.nonStriker;
                  
                  return (
                    <tr key={player.id} className="border-b border-surface-light">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          {player.name}
                          {isCurrentlyBatting && (
                            <span className="ml-2 text-accent text-xs">*</span>
                          )}
                        </div>
                        {stats.isOut && stats.outMethod && (
                          <div className="text-xs text-white/50">
                            {stats.outMethod} 
                            {stats.bowler && ` b ${bowlingTeam.players.find(p => p.id === stats.bowler)?.name}`}
                            {stats.fielder && ` c ${bowlingTeam.players.find(p => p.id === stats.fielder)?.name}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {stats.runs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {stats.balls}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {stats.fours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {stats.sixes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {stats.balls > 0 ? stats.strikeRate.toFixed(1) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Bowling Scorecard */}
      {activeTab === 'bowling' && (
        <Card>
          <h2 className="text-xl font-bold mb-3">Bowling - {bowlingTeam.name}</h2>
          
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-light">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Bowler
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    O
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    M
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    R
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    W
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    Econ
                  </th>
                </tr>
              </thead>
              <tbody>
                {bowlingTeam.players
                  .filter(player => player.bowling && player.bowling.overs > 0)
                  .map((player) => {
                    const stats = player.bowling || { 
                      overs: 0, maidens: 0, runs: 0, wickets: 0, economy: 0 
                    };
                    
                    const isCurrentBowler = player.id === innings.currentBowler;
                    
                    return (
                      <tr key={player.id} className="border-b border-surface-light">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center">
                            {player.name}
                            {isCurrentBowler && (
                              <span className="ml-2 text-primary text-xs">*</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {formatOvers(stats.overs)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {stats.maidens}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {stats.runs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {stats.wickets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {stats.overs > 0 ? stats.economy.toFixed(1) : '-'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Match Result or Continue Button */}
      <div className="mt-6">
        {!currentMatch.inProgress ? (
          <Card className="bg-primary/10">
            <div className="text-center">
              <Trophy size={48} className="mx-auto mb-2 text-accent" />
              <h2 className="text-xl font-bold mb-2">Match Result</h2>
              <p className="text-lg">{matchResult}</p>
            </div>
            
            <Button 
              variant="primary"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Card>
        ) : (
          <Button 
            variant="primary"
            fullWidth
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            onClick={handleContinue}
          >
            Continue Scoring
          </Button>
        )}
      </div>
    </div>
  );
};

export default Scorecard;