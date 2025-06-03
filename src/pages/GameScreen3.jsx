import React, { useEffect, useState } from "react";
import WorldMap from "../components/WorldMap";
import { useGame } from "../context/GameContext";
import BeachScene from "../components/BeachScene";
import MountainScene from "../components/MountainScene";
import LakeScene from "../components/LakeScene";
import HomeScene from "../components/HomeScene";
import TempleScene from "../components/TempleScene";
import MovementControls from "../components/MovementControls";

const RARITY_COLORS = {
  common: "border-gray-400 bg-gray-400/10 text-gray-300",
  uncommon: "border-green-400 bg-green-400/10 text-green-300",
  rare: "border-blue-400 bg-blue-400/10 text-blue-300",
  epic: "border-purple-400 bg-purple-400/10 text-purple-300",
  legendary: "border-yellow-400 bg-yellow-400/10 text-yellow-300",
};

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];

const GameScreen3 = ({ playerName, avatarIndex, onGameOver }) => {
  const {
    getGreeting,
    gameTime,
    formatTime,
    stats,
    handleUseItem,
    setIsGameOver,
  } = useGame();
  const [currentScene, setCurrentScene] = useState("world");

  useEffect(() => {
    const { meal, sleep, hygiene, happiness } = stats;

    if (meal <= 0) {
      onGameOver("You died of hunger.");
      setIsGameOver(true);
    } else if (sleep <= 0) {
      onGameOver("You died of exhaustion.");
      setIsGameOver(true);
    } else if (hygiene <= 0) {
      onGameOver("You died of disease.");
      setIsGameOver(true);
    } else if (happiness <= 0) {
      onGameOver("You died of depression.");
      setIsGameOver(true);
    }
  }, [stats, onGameOver]);

  const renderScene = () => {
    switch (currentScene) {
      case "beach":
        return <BeachScene onBack={() => setCurrentScene("world")} />;
      case "lake":
        return <LakeScene onBack={() => setCurrentScene("world")} />;
      case "mountain":
        return <MountainScene onBack={() => setCurrentScene("world")} />;
      case "home":
        return <HomeScene onBack={() => setCurrentScene("world")} />;
      case "temple":
        return <TempleScene onBack={() => setCurrentScene("world")} />;
      default:
        return <WorldMap onSelectArea={setCurrentScene} />;
    }
  };

  return (
    <div className="h-svh w-svw font-['Orbitron'] overflow-x-hidden">
      <div className=" h-full py-6 px-2 bg-gradient-to-b from-[#150c3f] via-[#191a43] to-[#07072c] flex flex-col font-sci">
        {/* STATUS BAR */}
        <div className="w-full px-8 py-3 mb-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 bg-[#232263a8] shadow-[0_2px_24px_1px_#4b4af933] backdrop-blur-md border border-[#292979] animate-fade-in">
          <div className="flex items-center gap-4">
            <img
              src={`avatar${avatarIndex + 1}.png`}
              className="w-12 h-12 rounded-full border-2 border-[#525CEB] shadow-lg bg-white shrink-0"
              alt="Avatar"
            />
            <div>
              <div className="text-[#4361EE] font-bold tracking-wide text-xl">
                {playerName}
              </div>
              <div className="text-gray-200 text-xs">{getGreeting()}</div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-5 justify-center w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-[650px]">
              {Object.entries(stats)
                .filter(([key]) => key !== "money" && key !== "inventory")
                .map(([key, value]) => (
                  <div key={key} className="w-full">
                    <div className="flex items-center gap-2">
                      {/* <span>{item.icon}</span> */}
                      <span className="text-xs font-bold capitalize">
                        {key}
                      </span>
                      <span className="ml-auto text-xs text-[#70e0d7] font-bold">
                        {Math.round(value)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#535C91] mt-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#525CEB] transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col text-right text-sm tracking-wider leading-tight text-gray-300 font-bold">
            <span>Day {gameTime.day}</span>
            <span className="text-white">
              {formatTime(gameTime.hour, gameTime.minute)}
            </span>
            <span className="text-white">
              Rp{" "}
              <span className="text-[#60ffe4] font-extrabold">
                {stats?.money?.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="h-full flex-1 flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
          {renderScene()}
          <div
            className="
            w-full max-w-md min-h-[420px] bg-gradient-to-br from-[#232263ee] to-[#401a759a] rounded-2xl
            shadow-[0_1px_30px_2px_#7c73f966] flex flex-col p-6 gap-6 border border-[#444195] backdrop-blur-md overflow-y-auto"
          >
            <div>
              <MovementControls />
            </div>
            <div className="text-start">
              <h2 className="text-xl font-extrabold tracking-widest font-sci mb-2">
                🎒 Inventory
              </h2>
              <p className="text-xs text-[#a8d1ff80]">
                Items: {stats.inventory.length}
              </p>
            </div>

            <div className="flex-1">
              {stats.inventory.length === 0 ? (
                <div className="text-center text-[#a8d1ff80] py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p>Inventory kosong</p>
                  <p className="text-xs mt-1">
                    Lakukan aktivitas untuk mendapatkan item!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 text-start">
                  {stats.inventory
                    .sort(
                      (a, b) =>
                        RARITY_ORDER.indexOf(b.rarity) -
                        RARITY_ORDER.indexOf(a.rarity)
                    )
                    .map((item) => (
                      <div
                        key={item.value}
                        className={`p-3 rounded-xl border-2 ${
                          RARITY_COLORS[item.rarity]
                        }`}
                        title={`${item.name} - ${item.rarity}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <div className="text-xs font-bold">
                              {item.quantity}x {item.name}
                            </div>
                            <div className="text-[10px] opacity-60 mt-1 flex gap-2 flex-wrap">
                              {item.effects ? (
                                Object.entries(item.effects).map(
                                  ([key, value]) => (
                                    <span key={`effect-${item.value}-${key}`}>
                                      {value >= 0 ? "+" : ""}
                                      {value}{" "}
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                    </span>
                                  )
                                )
                              ) : (
                                <span>{item.description}</span>
                              )}
                            </div>
                          </div>
                          {item.effects && (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleUseItem(item)}
                                className="bg-green-500/20 hover:bg-green-500/40 text-green-300 text-xs px-3 py-1 rounded border border-green-500/50 hover:border-green-500 transition-all cursor-pointer"
                              >
                                Use
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen3;
