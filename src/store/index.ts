import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Match, Team, Player, GameMode, 
  PlayerRole, BallEvent, Innings 
} from '../types';
import { generateId } from '../utils/helpers';

interface GameState {
  matches: Match[];
  currentMatch: Match | null;
  gameMode: GameMode;
  
  // Match Creation actions
  setGameMode: (mode: GameMode) => void;
  createTeam: (name: string, playerCount: number) => Team;
  updateTeam: (team: Team) => void;
  addPlayer: (team: Team, name: string, role: PlayerRole) => void;
  updatePlayer: (player: Player) => void;
  createMatch: (teams: Team[], overs: number) => void;
  
  // Match Progress actions
  setTossResult: (winner: string, choice: 'bat' | 'bowl') => void;
  selectBatsmen: (striker: string, nonStriker: string) => void;
  selectBowler: (bowler: string) => void;
  recordBallEvent: (event: BallEvent) => void;
  endOver: () => void;
  endInnings: () => void;
  endMatch: (result: string) => void;
  
  // Helper functions
  getCurrentInnings: () => Innings | null;
  getTeamPlayers: (teamId: string) => Player[];
  getBattingTeam: () => Team | null;
  getBowlingTeam: () => Team | null;
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      matches: [],
      currentMatch: null,
      gameMode: 'custom',
      
      setGameMode: (mode) => set({ gameMode: mode }),
      
      createTeam: (name, playerCount) => {
        const team: Team = {
          id: generateId(),
          name,
          players: []
        };
        
        // For express mode, auto-generate players
        if (get().gameMode === 'express') {
          for (let i = 1; i <= playerCount; i++) {
            team.players.push({
              id: generateId(),
              name: `Player ${i}`,
              team: team.id,
              role: 'All Rounder'
            });
          }
        }
        
        return team;
      },
      
      updateTeam: (team) => {
        if (!get().currentMatch) return;
        
        const teams = get().currentMatch.teams.map(t => 
          t.id === team.id ? team : t
        );
        
        set({
          currentMatch: {
            ...get().currentMatch,
            teams
          }
        });
      },
      
      addPlayer: (team, name, role) => {
        const player: Player = {
          id: generateId(),
          name,
          team: team.id,
          role
        };
        
        const updatedTeam = {
          ...team,
          players: [...team.players, player]
        };
        
        get().updateTeam(updatedTeam);
      },
      
      updatePlayer: (player) => {
        if (!get().currentMatch) return;
        
        const teams = get().currentMatch.teams.map(team => {
          if (team.id === player.team) {
            return {
              ...team,
              players: team.players.map(p => 
                p.id === player.id ? player : p
              )
            };
          }
          return team;
        });
        
        set({
          currentMatch: {
            ...get().currentMatch,
            teams
          }
        });
      },
      
      createMatch: (teams, overs) => {
        const match: Match = {
          id: generateId(),
          date: new Date(),
          teams,
          totalOvers: overs,
          innings: [],
          currentInnings: 0,
          inProgress: true
        };
        
        set({
          currentMatch: match,
          matches: [...get().matches, match]
        });
      },
      
      setTossResult: (winner, choice) => {
        if (!get().currentMatch) return;
        
        const battingTeamId = choice === 'bat' 
          ? winner 
          : get().currentMatch.teams.find(t => t.id !== winner)?.id;
          
        const bowlingTeamId = choice === 'bowl' 
          ? winner 
          : get().currentMatch.teams.find(t => t.id !== winner)?.id;
        
        if (!battingTeamId || !bowlingTeamId) return;
        
        const innings: Innings = {
          battingTeam: battingTeamId,
          bowlingTeam: bowlingTeamId,
          overs: [],
          currentOver: 0,
          currentBall: 0,
          totalRuns: 0,
          totalWickets: 0,
          extras: {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0,
            penalty: 0
          },
          striker: null,
          nonStriker: null,
          currentBowler: null
        };
        
        set({
          currentMatch: {
            ...get().currentMatch,
            tossWinner: winner,
            tossChoice: choice,
            innings: [innings],
            currentInnings: 0
          }
        });
      },
      
      selectBatsmen: (striker, nonStriker) => {
        if (!get().currentMatch) return;
        
        const innings = get().getCurrentInnings();
        if (!innings) return;
        
        const updatedInnings = {
          ...innings,
          striker,
          nonStriker
        };
        
        const allInnings = [...get().currentMatch.innings];
        allInnings[get().currentMatch.currentInnings] = updatedInnings;
        
        set({
          currentMatch: {
            ...get().currentMatch,
            innings: allInnings
          }
        });
      },
      
      selectBowler: (bowler) => {
        if (!get().currentMatch) return;
        
        const innings = get().getCurrentInnings();
        if (!innings) return;
        
        // Create a new over if needed
        if (innings.currentBall === 0) {
          const newOver = {
            number: innings.currentOver,
            balls: [],
            bowler
          };
          
          const updatedInnings = {
            ...innings,
            overs: [...innings.overs, newOver],
            currentBowler: bowler
          };
          
          const allInnings = [...get().currentMatch.innings];
          allInnings[get().currentMatch.currentInnings] = updatedInnings;
          
          set({
            currentMatch: {
              ...get().currentMatch,
              innings: allInnings
            }
          });
        } else {
          // Just update the current bowler
          const updatedInnings = {
            ...innings,
            currentBowler: bowler
          };
          
          const allInnings = [...get().currentMatch.innings];
          allInnings[get().currentMatch.currentInnings] = updatedInnings;
          
          set({
            currentMatch: {
              ...get().currentMatch,
              innings: allInnings
            }
          });
        }
      },
      
      recordBallEvent: (event) => {
        if (!get().currentMatch) return;
        
        const innings = get().getCurrentInnings();
        if (!innings || !innings.striker || !innings.nonStriker || !innings.currentBowler) return;
        
        // Get current over
        const currentOverIndex = innings.overs.length - 1;
        if (currentOverIndex < 0) return;
        
        const currentOver = innings.overs[currentOverIndex];
        
        // Add the ball event
        const updatedOver = {
          ...currentOver,
          balls: [...currentOver.balls, event]
        };
        
        // Update innings with the new ball
        const allOvers = [...innings.overs];
        allOvers[currentOverIndex] = updatedOver;
        
        // Calculate new state based on the event
        let newStriker = innings.striker;
        let newNonStriker = innings.nonStriker;
        let extraRuns = 0;
        let isLegalDelivery = true;
        
        // Handle extras
        if (event.type === 'extra') {
          if (event.extraType === 'wide') {
            extraRuns = event.value;
            isLegalDelivery = false;
            innings.extras.wides += event.value;
          } else if (event.extraType === 'noBall') {
            extraRuns = 1 + event.value;
            isLegalDelivery = false;
            innings.extras.noBalls += 1;
          }
        }
        
        // Handle runs
        if (event.type === 'run') {
          // Switch striker for odd runs
          if (event.value % 2 === 1) {
            [newStriker, newNonStriker] = [newNonStriker, newStriker];
          }
        }
        
        // Handle wicket
        if (event.type === 'wicket' && event.batsmanOut && event.newBatsman) {
          if (event.batsmanOut === innings.striker) {
            newStriker = event.newBatsman;
          } else if (event.batsmanOut === innings.nonStriker) {
            newNonStriker = event.newBatsman;
          }
          
          // Update player stats
          const battingTeam = get().getBattingTeam();
          if (battingTeam) {
            const outPlayer = battingTeam.players.find(p => p.id === event.batsmanOut);
            if (outPlayer) {
              get().updatePlayer({
                ...outPlayer,
                batting: {
                  ...outPlayer.batting || { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
                  isOut: true,
                  outMethod: event.wicketType,
                  bowler: innings.currentBowler,
                  fielder: event.fielder
                }
              });
            }
          }
        }
        
        // Update batsman stats
        const battingTeam = get().getBattingTeam();
        if (battingTeam && isLegalDelivery) {
          const striker = battingTeam.players.find(p => p.id === innings.striker);
          if (striker && event.type === 'run') {
            const runs = event.value;
            const currentStats = striker.batting || { 
              runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false 
            };
            
            const newBalls = currentStats.balls + 1;
            const newRuns = currentStats.runs + runs;
            const newFours = runs === 4 ? currentStats.fours + 1 : currentStats.fours;
            const newSixes = runs === 6 ? currentStats.sixes + 1 : currentStats.sixes;
            
            get().updatePlayer({
              ...striker,
              batting: {
                ...currentStats,
                runs: newRuns,
                balls: newBalls,
                fours: newFours,
                sixes: newSixes,
                strikeRate: newBalls > 0 ? (newRuns / newBalls) * 100 : 0
              }
            });
          }
        }
        
        // Update bowler stats
        const bowlingTeam = get().getBowlingTeam();
        if (bowlingTeam && isLegalDelivery) {
          const bowler = bowlingTeam.players.find(p => p.id === innings.currentBowler);
          if (bowler) {
            const currentStats = bowler.bowling || { 
              overs: 0, maidens: 0, runs: 0, wickets: 0, economy: 0 
            };
            
            const ballsInOver = currentOver.balls.filter(b => {
              if (b.type === 'extra' && (b.extraType === 'wide' || b.extraType === 'noBall')) {
                return false;
              }
              return true;
            }).length;
            
            const totalBalls = currentStats.overs * 6 + ballsInOver;
            const newOvers = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
            
            let newRuns = currentStats.runs;
            if (event.type === 'run') {
              newRuns += event.value;
            } else if (event.type === 'extra' && event.extraType === 'wide') {
              newRuns += event.value;
            } else if (event.type === 'extra' && event.extraType === 'noBall') {
              newRuns += 1 + event.value;
            }
            
            let newWickets = currentStats.wickets;
            if (event.type === 'wicket' && 
                event.wicketType !== 'runOut' && 
                event.wicketType !== 'stumped') {
              newWickets += 1;
            }
            
            get().updatePlayer({
              ...bowler,
              bowling: {
                ...currentStats,
                overs: newOvers,
                runs: newRuns,
                wickets: newWickets,
                economy: newOvers > 0 ? newRuns / newOvers : 0
              }
            });
          }
        }
        
        // Update innings
        const newTotalRuns = innings.totalRuns + 
          (event.type === 'run' ? event.value : 0) + extraRuns;
        
        const newTotalWickets = innings.totalWickets + 
          (event.type === 'wicket' ? 1 : 0);
        
        const newBall = isLegalDelivery ? innings.currentBall + 1 : innings.currentBall;
        
        const updatedInnings = {
          ...innings,
          overs: allOvers,
          totalRuns: newTotalRuns,
          totalWickets: newTotalWickets,
          currentBall: newBall,
          striker: newStriker,
          nonStriker: newNonStriker,
          extras: innings.extras
        };
        
        const allInnings = [...get().currentMatch.innings];
        allInnings[get().currentMatch.currentInnings] = updatedInnings;
        
        set({
          currentMatch: {
            ...get().currentMatch,
            innings: allInnings
          }
        });
        
        // Check if the over is complete
        if (newBall === 6) {
          get().endOver();
        }
      },
      
      endOver: () => {
        if (!get().currentMatch) return;
        
        const innings = get().getCurrentInnings();
        if (!innings) return;
        
        // Swap striker and non-striker
        const updatedInnings = {
          ...innings,
          currentBall: 0,
          currentOver: innings.currentOver + 1,
          striker: innings.nonStriker,
          nonStriker: innings.striker,
          currentBowler: null // This will be set when selecting the next bowler
        };
        
        const allInnings = [...get().currentMatch.innings];
        allInnings[get().currentMatch.currentInnings] = updatedInnings;
        
        set({
          currentMatch: {
            ...get().currentMatch,
            innings: allInnings
          }
        });
      },
      
      endInnings: () => {
        if (!get().currentMatch) return;
        
        // Check if we can start second innings
        if (get().currentMatch.currentInnings === 0) {
          // Swap batting and bowling teams
          const currentInnings = get().getCurrentInnings();
          if (!currentInnings) return;
          
          const newInnings: Innings = {
            battingTeam: currentInnings.bowlingTeam,
            bowlingTeam: currentInnings.battingTeam,
            overs: [],
            currentOver: 0,
            currentBall: 0,
            totalRuns: 0,
            totalWickets: 0,
            extras: {
              wides: 0,
              noBalls: 0,
              byes: 0,
              legByes: 0,
              penalty: 0
            },
            striker: null,
            nonStriker: null,
            currentBowler: null
          };
          
          set({
            currentMatch: {
              ...get().currentMatch,
              innings: [...get().currentMatch.innings, newInnings],
              currentInnings: 1
            }
          });
        } else {
          // Match is over
          get().endMatch('Match Completed');
        }
      },
      
      endMatch: (result) => {
        if (!get().currentMatch) return;
        
        set({
          currentMatch: {
            ...get().currentMatch,
            result,
            inProgress: false
          }
        });
      },
      
      getCurrentInnings: () => {
        const match = get().currentMatch;
        if (!match) return null;
        
        return match.innings[match.currentInnings] || null;
      },
      
      getTeamPlayers: (teamId) => {
        const match = get().currentMatch;
        if (!match) return [];
        
        const team = match.teams.find(t => t.id === teamId);
        return team ? team.players : [];
      },
      
      getBattingTeam: () => {
        const match = get().currentMatch;
        if (!match) return null;
        
        const innings = get().getCurrentInnings();
        if (!innings) return null;
        
        return match.teams.find(t => t.id === innings.battingTeam) || null;
      },
      
      getBowlingTeam: () => {
        const match = get().currentMatch;
        if (!match) return null;
        
        const innings = get().getCurrentInnings();
        if (!innings) return null;
        
        return match.teams.find(t => t.id === innings.bowlingTeam) || null;
      }
    }),
    {
      name: 'cricket-scorer-storage',
    }
  )
);

export default useGameStore;