import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  SkipForward,
  User2,
  ArrowRight,
  // AlertCircle,
  XCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import useGameStore from "../store";
import { formatOvers, calculateRunRate, getPlayerById } from "../utils/helpers";
import { BallEvent } from "../types";

type WicketType =
  | "bowled"
  | "caught"
  | "lbw"
  | "runOut"
  | "stumped"
  | "hitWicket";

const ScoringScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentMatch,
    getCurrentInnings,
    getBattingTeam,
    getBowlingTeam,
    recordBallEvent,
    endInnings,
    selectBowler,
  } = useGameStore();

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showNextBowlerModal, setShowNextBowlerModal] = useState(false);
  const [wicketDetails, setWicketDetails] = useState({
    type: "bowled" as WicketType,
    fielder: "",
    newBatsman: "",
  });
  const [nextBowler, setNextBowler] = useState("");

  const innings = getCurrentInnings();
  const battingTeam = getBattingTeam();
  const bowlingTeam = getBowlingTeam();

  if (!currentMatch || !innings || !battingTeam || !bowlingTeam) {
    navigate("/mode-selection");
    return null;
  }

  if (!innings.striker || !innings.nonStriker || !innings.currentBowler) {
    navigate("/player-selection");
    return null;
  }

  const striker = getPlayerById(currentMatch.teams, innings.striker);
  const nonStriker = getPlayerById(currentMatch.teams, innings.nonStriker);
  const bowler = getPlayerById(currentMatch.teams, innings.currentBowler);

  if (!striker || !nonStriker || !bowler) {
    navigate("/player-selection");
    return null;
  }

  const availableBatsmen = battingTeam.players.filter((player) => {
    return (
      player.id !== striker.id &&
      player.id !== nonStriker.id &&
      (!player.batting || !player.batting.isOut)
    );
  });

  const availableBowlers = bowlingTeam.players.filter((player) => {
    return (
      (player.role === "Bowler" || player.role === "All Rounder") &&
      player.id !== innings.currentBowler
    );
  });

  const fielders = bowlingTeam.players.filter(
    (player) => player.id !== innings.currentBowler
  );

  const isTargetSet =
    currentMatch.innings.length > 1 && currentMatch.currentInnings === 1;
  const target = isTargetSet
    ? currentMatch.innings[0].totalRuns + 1
    : undefined;
  const runsLeft = target ? target - innings.totalRuns : undefined;
  const ballsLeft =
    currentMatch.totalOvers * 6 -
    (innings.currentOver * 6 + innings.currentBall);

  const isLastWicket = innings.totalWickets === battingTeam.players.length - 1;
  const isAllOversCompleted = innings.currentOver >= currentMatch.totalOvers;
  const isInningsCompleted =
    isLastWicket ||
    isAllOversCompleted ||
    (isTargetSet && target && innings.totalRuns >= target - 1);

  // Current over display
  const currentOverBalls: React.ReactNode[] = [];
  if (innings.overs.length > 0) {
    const currentOverIndex = innings.overs.length - 1;
    const currentOver = innings.overs[currentOverIndex];

    currentOver.balls.forEach((ball) => {
      if (ball.type === "wicket") {
        currentOverBalls.push(
          <span key={currentOverBalls.length} className="text-error font-bold">
            W
          </span>
        );
      } else if (ball.type === "run") {
        currentOverBalls.push(
          <span key={currentOverBalls.length}>{ball.value}</span>
        );
      } else if (ball.type === "extra") {
        if (ball.extraType === "wide") {
          currentOverBalls.push(
            <span key={currentOverBalls.length} className="text-warning">
              WD
            </span>
          );
        } else if (ball.extraType === "noBall") {
          currentOverBalls.push(
            <span key={currentOverBalls.length} className="text-warning">
              NB
            </span>
          );
        }
      }
    });
  }

  const handleScoringAction = (action: BallEvent) => {
    recordBallEvent(action);

    // Check if over is completed - will be handled by the store
  };

  const handleRun = (runs: number) => {
    handleScoringAction({
      type: "run",
      value: runs,
    });
  };

  const handleExtra = (type: "wide" | "noBall", value: number = 1) => {
    handleScoringAction({
      type: "extra",
      value: value,
      extraType: type,
    });
  };

  const handleWicket = () => {
    setShowWicketModal(true);
  };

  const handleWicketConfirm = () => {
    if (!wicketDetails.newBatsman) return;

    handleScoringAction({
      type: "wicket",
      value: 0,
      wicketType: wicketDetails.type,
      fielder: wicketDetails.fielder || undefined,
      batsmanOut: innings.striker || undefined,
      newBatsman: wicketDetails.newBatsman,
    });

    setShowWicketModal(false);

    // Reset wicket details
    setWicketDetails({
      type: "bowled",
      fielder: "",
      newBatsman: "",
    });
  };

  const handleNextBowlerSelect = () => {
    if (!nextBowler) return;

    selectBowler(nextBowler);
    setShowNextBowlerModal(false);
    setNextBowler("");
  };

  const handleNextBowler = () => {
    setShowNextBowlerModal(true);
  };

  const handleEndInnings = () => {
    endInnings();
    navigate("/player-selection");
  };

  return (
    <>
      <div className="max-w-lg mx-auto pb-10">
        {/* Score Summary */}
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-white/70">
                {battingTeam.name}
              </h2>
              <div className="text-3xl font-bold flex items-baseline">
                {innings.totalRuns}/{innings.totalWickets}
                <span className="text-lg text-white/60 ml-2">
                  ({formatOvers(innings.currentOver + innings.currentBall / 10)}
                  )
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-medium text-white/70">RR</div>
              <div className="text-2xl font-bold">
                {calculateRunRate(
                  innings.totalRuns,
                  innings.currentOver + innings.currentBall / 10
                )}
              </div>
            </div>
          </div>

          {isTargetSet && (
            <div className="bg-primary/10 p-3 rounded-lg mb-3">
              <div className="flex justify-between">
                <div>
                  <span className="text-white/70">Target</span>
                  <div className="font-bold">{target}</div>
                </div>
                <div>
                  <span className="text-white/70">Needed</span>
                  <div className="font-bold">
                    {runsLeft} from {Math.ceil(ballsLeft / 6)} overs
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <div className="flex items-center text-secondary mb-1">
                <User2 size={16} className="mr-1" />
                <span className="text-sm">Striker</span>
              </div>
              <div className="font-bold">{striker.name}</div>
              <div className="text-sm text-white/70">
                {striker.batting?.runs || 0} ({striker.batting?.balls || 0})
              </div>
            </div>

            <div className="bg-accent/10 p-3 rounded-lg">
              <div className="flex items-center text-accent mb-1">
                <User2 size={16} className="mr-1" />
                <span className="text-sm">Non-striker</span>
              </div>
              <div className="font-bold">{nonStriker.name}</div>
              <div className="text-sm text-white/70">
                {nonStriker.batting?.runs || 0} (
                {nonStriker.batting?.balls || 0})
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center text-primary mb-1">
              <Award size={16} className="mr-1" />
              <span className="text-sm">Bowler: {bowler.name}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">
                  {bowler.bowling?.overs || 0}-{bowler.bowling?.maidens || 0}-
                  {bowler.bowling?.runs || 0}-{bowler.bowling?.wickets || 0}
                </span>
              </div>

              <div>
                Current over:
                <div className="inline-flex space-x-2 ml-2">
                  {currentOverBalls.length > 0 ? (
                    currentOverBalls.map((ball, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 flex items-center justify-center bg-surface-light rounded-full"
                      >
                        {ball}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/40">No balls yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Scoring Actions */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Scoring</h2>

          {isInningsCompleted ? (
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Innings Complete</h3>
                <p className="text-white/70 mb-4">
                  {isLastWicket
                    ? "All out"
                    : isAllOversCompleted
                    ? "All overs completed"
                    : "Target achieved"}
                </p>

                <Button onClick={handleEndInnings} variant="primary">
                  {currentMatch.currentInnings === 0
                    ? "Start Second Innings"
                    : "View Match Summary"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  onClick={() => handleRun(0)}
                  variant="ghost"
                  className="bg-surface-light"
                >
                  0
                </Button>
                <Button
                  onClick={() => handleRun(1)}
                  variant="ghost"
                  className="bg-surface-light"
                >
                  1
                </Button>
                <Button
                  onClick={() => handleRun(2)}
                  variant="ghost"
                  className="bg-surface-light"
                >
                  2
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  onClick={() => handleRun(3)}
                  variant="ghost"
                  className="bg-surface-light"
                >
                  3
                </Button>
                <Button
                  onClick={() => handleRun(4)}
                  variant="ghost"
                  className="bg-success/80"
                >
                  4
                </Button>
                <Button
                  onClick={() => handleRun(6)}
                  variant="ghost"
                  className="bg-accent/80"
                >
                  6
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  onClick={() => handleExtra("wide")}
                  variant="ghost"
                  className="bg-warning/30"
                >
                  Wide
                </Button>
                <Button
                  onClick={() => handleExtra("noBall")}
                  variant="ghost"
                  className="bg-warning/30"
                >
                  No Ball
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleWicket}
                  variant="ghost"
                  className="bg-error/30"
                >
                  Wicket
                </Button>

                {innings.currentBall === 6 && (
                  <Button
                    onClick={handleNextBowler}
                    variant="ghost"
                    className="bg-primary/30"
                    icon={<SkipForward size={18} />}
                  >
                    End Over
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center text-error">
              <XCircle size={24} className="mr-2" />
              Wicket
            </h2>

            <div className="mb-4">
              <Select
                label="Wicket Type"
                options={[
                  { value: "bowled", label: "Bowled" },
                  { value: "caught", label: "Caught" },
                  { value: "lbw", label: "LBW" },
                  { value: "runOut", label: "Run Out" },
                  { value: "stumped", label: "Stumped" },
                  { value: "hitWicket", label: "Hit Wicket" },
                ]}
                value={wicketDetails.type}
                onChange={(value) =>
                  setWicketDetails({
                    ...wicketDetails,
                    type: value as WicketType,
                  })
                }
                fullWidth
              />
            </div>

            {(wicketDetails.type === "caught" ||
              wicketDetails.type === "runOut" ||
              wicketDetails.type === "stumped") && (
              <div className="mb-4">
                <Select
                  label="Fielder"
                  options={fielders.map((fielder) => ({
                    value: fielder.id,
                    label: fielder.name,
                  }))}
                  value={wicketDetails.fielder}
                  onChange={(value) =>
                    setWicketDetails({ ...wicketDetails, fielder: value })
                  }
                  fullWidth
                />
              </div>
            )}

            <div className="mb-4">
              <Select
                label="New Batsman"
                options={availableBatsmen.map((batsman) => ({
                  value: batsman.id,
                  label: batsman.name,
                }))}
                value={wicketDetails.newBatsman}
                onChange={(value) =>
                  setWicketDetails({ ...wicketDetails, newBatsman: value })
                }
                fullWidth
                error={
                  !wicketDetails.newBatsman
                    ? "Please select the next batsman"
                    : undefined
                }
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowWicketModal(false)}
                variant="ghost"
                fullWidth
              >
                Cancel
              </Button>

              <Button
                onClick={handleWicketConfirm}
                variant="primary"
                fullWidth
                disabled={!wicketDetails.newBatsman}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Next Bowler Modal */}
      {showNextBowlerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ArrowRight size={24} className="mr-2 text-primary" />
              Next Bowler
            </h2>

            <div className="mb-4">
              <Select
                label="Select Bowler"
                options={availableBowlers.map((bowler) => ({
                  value: bowler.id,
                  label: bowler.name,
                }))}
                value={nextBowler}
                onChange={setNextBowler}
                fullWidth
                error={
                  !nextBowler ? "Please select the next bowler" : undefined
                }
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowNextBowlerModal(false)}
                variant="ghost"
                fullWidth
              >
                Cancel
              </Button>

              <Button
                onClick={handleNextBowlerSelect}
                variant="primary"
                fullWidth
                disabled={!nextBowler}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ScoringScreen;
