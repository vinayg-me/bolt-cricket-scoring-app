export type PlayerRole = 'Batsman' | 'Bowler' | 'All Rounder' | 'Keeper';

export interface Player {
  id: string;
  name: string;
  team: string;
  role: PlayerRole;
  batting?: BattingStats;
  bowling?: BowlingStats;
  isOut?: boolean;
  isCurrentBowler?: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface BattingStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  outMethod?: string;
  bowler?: string;
  fielder?: string;
}

export interface BowlingStats {
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface BallEvent {
  type: 'run' | 'wicket' | 'extra';
  value: number;
  extraType?: 'wide' | 'noBall';
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket';
  fielder?: string;
  batsmanOut?: string;
  newBatsman?: string;
}

export interface Over {
  number: number;
  balls: BallEvent[];
  bowler: string;
}

export interface Innings {
  battingTeam: string;
  bowlingTeam: string;
  overs: Over[];
  currentOver: number;
  currentBall: number;
  totalRuns: number;
  totalWickets: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
  };
  striker: string | null;
  nonStriker: string | null;
  currentBowler: string | null;
}

export interface Match {
  id: string;
  date: Date;
  venue?: string;
  teams: Team[];
  totalOvers: number;
  innings: Innings[];
  currentInnings: number;
  tossWinner?: string;
  tossChoice?: 'bat' | 'bowl';
  result?: string;
  inProgress: boolean;
}

export type GameMode = 'custom' | 'express';