import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import SelectionScreen from "./pages/SelectionScreen";
import StartScreen from "./pages/StartScreen";
import GameScreen from "./pages/GameScreen";
import GameOverScreen from "./pages/GameOverScreen";
import MemberScreen from "./pages/MemberScreen";
import MainGameFlowUpdate from "./pages/MainGameFlowUpdate";

function MainGameFlow() {
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
        <GameScreen
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
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Game utama (mode lama) */}
        <Route path="/v1" element={<MainGameFlow />} />

        {/* GameScreen2: versi test */}
        <Route path="/" element={<MainGameFlowUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;
