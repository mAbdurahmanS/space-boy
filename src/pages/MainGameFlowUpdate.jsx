import { useState } from "react";
import { GameProvider } from "../context/GameContext";
import StartScreen from "./StartScreen";
import SelectionScreen from "./SelectionScreen";
import GameScreen3 from "./GameScreen3";
import GameOverScreen from "./GameOverScreen";
import MemberScreen from "./MemberScreen";

export default function MainGameFlowUpdate() {
  const [gameState, setGameState] = useState("start");
  const [avatar, setAvatar] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [gameOverReason, setGameOverReason] = useState("");

  const startGame = (name, avatar) => {
    setPlayerName(name);
    setAvatar(avatar);
    setGameState("playing");
  };

  const endGame = (reason) => {
    setGameOverReason(reason);
    setGameState("gameover");
  };

  const restartGame = () => {
    setAvatar(0);
    setPlayerName("");
    setGameOverReason("");
    setGameState("start");
  };

  return (
    <GameProvider>
      <main className="h-svh w-svw">
        {gameState === "start" && (
          <StartScreen
            onStart={() => setGameState("selection")}
            onViewMembers={() => setGameState("members")}
          />
        )}
        {gameState === "selection" && (
          <SelectionScreen
            onNavigateToStart={() => setGameState("start")}
            onStartGame={startGame}
          />
        )}
        {gameState === "playing" && (
          <GameScreen3
            playerName={playerName}
            avatarIndex={avatar}
            onGameOver={endGame}
          />
        )}
        {gameState === "gameover" && (
          <GameOverScreen onRestart={restartGame} reason={gameOverReason} />
        )}
        {gameState === "members" && (
          <MemberScreen onBack={() => setGameState("start")} />
        )}
      </main>
    </GameProvider>
  );
}
