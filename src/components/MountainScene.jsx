import React, { useState, useEffect, useRef } from "react";
import MovementControls from "./MovementControls";
import { useGame } from "../context/GameContext";
import { FastForward } from "lucide-react";
import ActivityButtons from "./ActivityButtons";
import { isPlayerNearZone } from "../utils/isPlayerNearZone";

const spaceZone = {
  id: "space",
  x: 75,
  y: 70,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🛸 Back to Space",
      value: "space",
      effects: {
        sleep: -20,
        meal: -15,
        hygiene: -10,
        happiness: 25,
      },
    },
  ],
};

const mountainZone = {
  id: "mountain",
  x: 40,
  y: 40,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🥾 Hiking",
      value: "hiking",
      effects: {
        sleep: -15,
        happiness: 18,
        meal: -10,
        hygiene: -5,
      },
    },
    {
      label: "🔥 Campfire",
      value: "campfire",
      effects: {
        happiness: 10,
        meal: 10,
        sleep: 8,
      },
    },
    {
      label: "📸 Take Scenic Photo",
      value: "take_scenic_photo",
      effects: {
        sleep: -10,
        happiness: 5,
        meal: -5,
        hygiene: -5,
      },
      item: {
        value: "scenic_photo",
        name: "Scenic Photo",
        icon: "📸",
        rarity: "common",
        effects: { money: 30 },
        stackable: true,
      },
    },
  ],
};

const riverZone = {
  id: "river",
  x: 5,
  y: 39,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🎣 Fishing",
      value: "fishing",
      effects: {
        meal: 18,
        happiness: 4,
        sleep: -5,
      },
    },
    {
      label: "💧 Wash Face",
      value: "wash_face",
      effects: {
        hygiene: 12,
        happiness: 5,
        meal: -2,
      },
    },
  ],
};

const shopZone = {
  id: "shop",
  x: 75,
  y: 15,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🧥 Buy Jacket",
      value: "buy_jacket",
      effects: {
        happiness: 12,
        money: -120,
      },
    },
    {
      label: "🥾 Buy Hiking Boots",
      value: "buy_boots",
      effects: {
        happiness: 15,
        money: -160,
      },
    },
    {
      label: "📸 Sell Scenic Photos",
      value: "sell_photos",
      effects: {
        money: 100,
        sleep: -10,
        happiness: 5,
      },
    },
  ],
};

export default function MountainScene({ onBack }) {
  const {
    playerPosition,
    updateStats,
    isActivityActive,
    setIsActivityActive,
    addItem,
    hasItem,
    removeItem,
    restoreLastWorldPosition,
    stats,
  } = useGame();
  const [nearZone, setNearZone] = useState(null);
  const [activityProgress, setActivityProgress] = useState(0);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const hasFinishedActivity = useRef(false);

  const startActivity = (activity) => {
    setIsActivityActive(true);
    setCurrentActivity(activity);
    setActivityProgress(0); // mulai dari 0
  };

  const fastForward = () => {
    setActivityProgress(100);
  };

  useEffect(() => {
    if (isActivityActive) {
      hasFinishedActivity.current = false; // reset flag saat mulai

      const interval = setInterval(() => {
        setActivityProgress((prev) => {
          const next = prev + 5;
          if (next >= 100 && !hasFinishedActivity.current) {
            hasFinishedActivity.current = true; // tandai sudah selesai

            if (currentActivity) {
              updateStats(currentActivity.effects || {});

              if (currentActivity.item) {
                addItem(currentActivity.item);
              }

              if (currentActivity.removeItem) {
                removeItem(currentActivity.removeItem);
              }

              if (currentActivity.value === "space") {
                restoreLastWorldPosition();
                onBack();
              }
            }

            setIsActivityActive(false);
            setCurrentActivity(null);
            clearInterval(interval);
            return 100;
          }

          return next;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isActivityActive, currentActivity]);

  useEffect(() => {
    const zones = [spaceZone, mountainZone, riverZone, shopZone];

    const foundZone = zones.find((zone) =>
      isPlayerNearZone(playerPosition, zone)
    );
    if (foundZone) {
      setNearZone(foundZone.id);
      setAvailableActivities(foundZone.activities || []);
    } else {
      setNearZone(null);
      setAvailableActivities([]);
    }
  }, [playerPosition]);

  return (
    <div className="h-full flex-1 flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
      {/* BOARD MAP */}
      <div className="relative flex-1 rounded-xl shadow-xl overflow-hidden starry-bg border border-[#292979]">
        <div
          // ref={starsRef}
          className="pointer-events-none absolute w-full h-full z-0"
          style={{
            // aspectRatio: "1440 / 1464",
            // backgroundColor: getMapColor(),
            backgroundImage: `url(/mountain2.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // transition: "background-color 0.5s ease",
          }}
        ></div>

        {/* Locations */}
        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "space"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${spaceZone.x}%`,
            top: `${spaceZone.y}%`,
            width: `${spaceZone.width}%`,
            height: `${spaceZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Space</span>
        </div>

        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "mountain"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${mountainZone.x}%`,
            top: `${mountainZone.y}%`,
            width: `${mountainZone.width}%`,
            height: `${mountainZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Mountain</span>
        </div>

        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "river"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${riverZone.x}%`,
            top: `${riverZone.y}%`,
            width: `${riverZone.width}%`,
            height: `${riverZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>River</span>
        </div>

        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "shop"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${shopZone.x}%`,
            top: `${shopZone.y}%`,
            width: `${shopZone.width}%`,
            height: `${shopZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Shop</span>
        </div>

        {/* Character */}
        <img
          src={`avatar1.png`}
          alt="Player Sprite"
          className="absolute z-20 object-contain"
          style={{
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
            transform: "translate(-50%, -50%)",
            width: "10%",
            height: "10%",
            imageRendering: "pixelated",
          }}
        />

        <ActivityButtons
          availableActivities={availableActivities}
          isActivityActive={isActivityActive}
          hasItem={hasItem}
          startActivity={startActivity}
          allZones={[shopZone, mountainZone, riverZone, spaceZone]} // atau bisa kamu pakai global variable jika semua zona ada dalam satu array
          playerStats={stats}
        />

        {isActivityActive && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border-4 border-blue-400">
              <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">
                {currentActivity?.label || "Doing Activity"}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-6 mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 h-6 rounded-full transition-all duration-100 shadow-inner"
                  style={{ width: `${activityProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700 font-semibold">
                  {activityProgress}%
                </span>
                <button
                  onClick={fastForward}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white font-bold px-4 py-2 rounded-xl shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 4.5v15m0 0L15 12 4.5 4.5zM15 4.5v15"
                    />
                  </svg>
                  Fast Forward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
