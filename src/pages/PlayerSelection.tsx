import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import useGameStore from "../store";

const PlayerSelection: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentMatch,
    getCurrentInnings,
    getBattingTeam,
    getBowlingTeam,
    selectBatsmen,
    selectBowler,
  } = useGameStore();
  const innings = getCurrentInnings();
  const battingTeam = getBattingTeam();
  const bowlingTeam = getBowlingTeam();
  const batsmen = battingTeam?.players ?? [];

  const getCurrentStriker = () => {
    return (
      currentMatch?.innings[currentMatch.currentInnings - 1]?.striker ??
      batsmen[0].id
    );
  };

  const getCurrentNonStriker = () => {
    return (
      currentMatch?.innings[currentMatch.currentInnings - 1]?.nonStriker ??
      batsmen[1].id
    );
  };

  const getCurrentBowler = () => {
    return (
      currentMatch?.innings[currentMatch.currentInnings - 1]?.currentBowler ??
      bowlingTeam?.players[bowlingTeam.players.length - 1].id
    );
  };

  const [striker, setStriker] = useState<string>(getCurrentStriker());
  const [nonStriker, setNonStriker] = useState<string>(getCurrentNonStriker());
  const [bowler, setBowler] = useState<string | undefined>(
    getCurrentBowler()
  );
  const [errors, setErrors] = useState<{
    striker?: string;
    nonStriker?: string;
    bowler?: string;
  }>({});

  // Navigate back if match data is missing
  useEffect(() => {
    if (!currentMatch || !innings || !battingTeam || !bowlingTeam) {
      navigate("/mode-selection");
    }
  }, [currentMatch, innings, battingTeam, bowlingTeam, navigate]);

  if (!currentMatch || !innings || !battingTeam || !bowlingTeam) {
    return null;
  }

  const bowlers = bowlingTeam.players.filter(
    (player) => player.role === "Bowler" || player.role === "All Rounder"
  );

  const validateSelections = () => {
    const newErrors: {
      striker?: string;
      nonStriker?: string;
      bowler?: string;
    } = {};

    if (!striker) {
      newErrors.striker = "Please select a striker";
    }

    if (!nonStriker) {
      newErrors.nonStriker = "Please select a non-striker";
    }

    if (striker && nonStriker && striker === nonStriker) {
      newErrors.nonStriker =
        "Striker and non-striker must be different players";
    }

    if (!bowler) {
      newErrors.bowler = "Please select a bowler";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartInnings = () => {
    if (validateSelections()) {
      selectBatsmen(striker, nonStriker);
      selectBowler(bowler ?? "");
      navigate("/scoring");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Select Players
      </motion.h1>

      <Card animate>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <div className="bg-secondary/20 p-2 rounded-full mr-2">
                <UserCircle2 size={20} className="text-secondary" />
              </div>
              Batting: {battingTeam.name}
            </h2>

            <Select
              label="Striker"
              options={batsmen
                .map((player) => ({
                  value: player.id,
                  label: player.name,
                  isOut: player.isOut,
                }))
                .filter(
                  (player) =>
                    !player.isOut && player.value !== nonStriker
                )}
              value={striker}
              onChange={setStriker}
              fullWidth
              error={errors.striker}
            />

            <Select
              label="Non-Striker"
              options={batsmen
                .map((player) => ({
                  value: player.id,
                  label: player.name,
                  isOut: player.isOut,
                }))
                .filter(
                  (player) =>
                    !player.isOut && player.value !== striker
                )}
              value={nonStriker}
              onChange={setNonStriker}
              fullWidth
              error={errors.nonStriker}
            />
          </div>

          <div className="border-t border-surface-light pt-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <div className="bg-accent/20 p-2 rounded-full mr-2">
                <UserCircle2 size={20} className="text-accent" />
              </div>
              Bowling: {bowlingTeam.name}
            </h2>

            <Select
              label="Opening Bowler"
              options={bowlers.map((player) => ({
                value: player.id,
                label: player.name,
              }))}
              value={bowler}
              onChange={setBowler}
              fullWidth
              error={errors.bowler}
            />
          </div>

          <Button
            onClick={handleStartInnings}
            variant="primary"
            fullWidth
            className="mt-6"
          >
            Start Innings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlayerSelection;
