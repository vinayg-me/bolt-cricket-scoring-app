/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `matches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `date` (timestamp)
      - `total_overs` (integer)
      - `status` (text)
      - `created_at` (timestamp)
    - `teams`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `name` (text)
      - `created_at` (timestamp)
    - `players`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    - `innings`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `batting_team_id` (uuid, references teams)
      - `bowling_team_id` (uuid, references teams)
      - `total_runs` (integer)
      - `total_wickets` (integer)
      - `current_over` (integer)
      - `current_ball` (integer)
      - `extras_wides` (integer)
      - `extras_no_balls` (integer)
      - `extras_byes` (integer)
      - `extras_leg_byes` (integer)
      - `extras_penalty` (integer)
      - `striker_id` (uuid, references players)
      - `non_striker_id` (uuid, references players)
      - `current_bowler_id` (uuid, references players)
      - `created_at` (timestamp)
    - `overs`
      - `id` (uuid, primary key)
      - `innings_id` (uuid, references innings)
      - `number` (integer)
      - `bowler_id` (uuid, references players)
      - `created_at` (timestamp)
    - `balls`
      - `id` (uuid, primary key)
      - `over_id` (uuid, references overs)
      - `ball_number` (integer)
      - `runs` (integer)
      - `extra_type` (text)
      - `extra_runs` (integer)
      - `wicket_type` (text)
      - `batsman_out_id` (uuid, references players)
      - `fielder_id` (uuid, references players)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  date timestamptz DEFAULT now(),
  total_overs integer NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own matches"
  ON matches
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD teams in their matches"
  ON teams
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = teams.match_id
      AND matches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = teams.match_id
      AND matches.user_id = auth.uid()
    )
  );

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id),
  name text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD players in their matches"
  ON players
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      JOIN matches ON matches.id = teams.match_id
      WHERE teams.id = players.team_id
      AND matches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      JOIN matches ON matches.id = teams.match_id
      WHERE teams.id = players.team_id
      AND matches.user_id = auth.uid()
    )
  );

-- Innings table
CREATE TABLE IF NOT EXISTS innings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id),
  batting_team_id uuid REFERENCES teams(id),
  bowling_team_id uuid REFERENCES teams(id),
  total_runs integer DEFAULT 0,
  total_wickets integer DEFAULT 0,
  current_over integer DEFAULT 0,
  current_ball integer DEFAULT 0,
  extras_wides integer DEFAULT 0,
  extras_no_balls integer DEFAULT 0,
  extras_byes integer DEFAULT 0,
  extras_leg_byes integer DEFAULT 0,
  extras_penalty integer DEFAULT 0,
  striker_id uuid REFERENCES players(id),
  non_striker_id uuid REFERENCES players(id),
  current_bowler_id uuid REFERENCES players(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE innings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD innings in their matches"
  ON innings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = innings.match_id
      AND matches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = innings.match_id
      AND matches.user_id = auth.uid()
    )
  );

-- Overs table
CREATE TABLE IF NOT EXISTS overs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id uuid REFERENCES innings(id),
  number integer NOT NULL,
  bowler_id uuid REFERENCES players(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE overs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD overs in their matches"
  ON overs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM innings
      JOIN matches ON matches.id = innings.match_id
      WHERE innings.id = overs.innings_id
      AND matches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM innings
      JOIN matches ON matches.id = innings.match_id
      WHERE innings.id = overs.innings_id
      AND matches.user_id = auth.uid()
    )
  );

-- Balls table
CREATE TABLE IF NOT EXISTS balls (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  over_id uuid REFERENCES overs(id),
  ball_number integer NOT NULL,
  runs integer DEFAULT 0,
  extra_type text,
  extra_runs integer DEFAULT 0,
  wicket_type text,
  batsman_out_id uuid REFERENCES players(id),
  fielder_id uuid REFERENCES players(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE balls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD balls in their matches"
  ON balls
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM overs
      JOIN innings ON innings.id = overs.innings_id
      JOIN matches ON matches.id = innings.match_id
      WHERE overs.id = balls.over_id
      AND matches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM overs
      JOIN innings ON innings.id = overs.innings_id
      JOIN matches ON matches.id = innings.match_id
      WHERE overs.id = balls.over_id
      AND matches.user_id = auth.uid()
    )
  );