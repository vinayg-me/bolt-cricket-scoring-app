import { Team } from "../types";

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Format overs (convert decimal overs to balls)
 * e.g. 4.3 means 4 overs and 3 balls
 */
export const formatOvers = (overs: number): string => {
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return `${fullOvers}.${balls}`;
};

/**
 * Calculate run rate
 */
export const calculateRunRate = (runs: number, overs: number): string => {
  if (overs === 0) return '0.00';
  return (runs / overs).toFixed(2);
};

/**
 * Calculate required run rate
 */
export const calculateRequiredRunRate = (
  target: number, 
  currentScore: number, 
  totalOvers: number, 
  oversPlayed: number
): string => {
  const runsRequired = target - currentScore;
  const oversRemaining = totalOvers - oversPlayed;
  
  if (oversRemaining <= 0 || runsRequired <= 0) return '0.00';
  
  return (runsRequired / oversRemaining).toFixed(2);
};

/**
 * Format ball number in current over
 * e.g. "4.2" means 4th over, 2nd ball
 */
export const formatBallNumber = (over: number, ball: number): string => {
  return `${over}.${ball}`;
};

/**
 * Get player by ID
 */
export const getPlayerById = (
  teams: Team[],
  playerId: string
) => {
  for (const team of teams) {
    const player = team.players.find(p => p.id === playerId);
    if (player){
      return player;
    }
  }
  return null;
};

/**
 * Format player name for display
 */
export const formatPlayerName = (name: string, isOut: boolean = false): string => {
  return isOut ? `${name} (out)` : name;
};

/**
 * Get remaining wickets
 */
export const getRemainingWickets = (teamSize: number, wickets: number): number => {
  return Math.max(0, teamSize - wickets);
};

/**
 * Calculate balls remaining
 */
export const getBallsRemaining = (
  totalOvers: number, 
  currentOver: number, 
  currentBall: number
): number => {
  return (totalOvers * 6) - (currentOver * 6 + currentBall);
};