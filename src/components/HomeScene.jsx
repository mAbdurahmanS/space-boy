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

const yardZone = {
  id: "yard",
  x: 36,
  y: 20,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🪴 Water the Plants",
      value: "water_plants_home",
      effects: {
        happiness: 8,
        hygiene: -3,
        meal: -3,
        sleep: -4,
      },
    },
    {
      label: "📖 Read a Book Outside",
      value: "read_yard",
      effects: {
        happiness: 12,
        sleep: -3,
      },
    },
  ],
};

const homeZone = {
  id: "home",
  x: 5,
  y: 50,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🛌 Take a Nap",
      value: "nap",
      effects: { sleep: 25 },
    },
    {
      label: "🚿 Take a Shower",
      value: "shower",
      effects: { hygiene: 25 },
    },
    {
      label: "🧹 Clean the Room",
      value: "clean_room",
      effects: { hygiene: 10, happiness: 3 },
    },
  ],
};

const kitchenZone = {
  id: "kitchen",
  x: 5,
  y: 20,
  width: 20,
  height: 20,
  activities: [
    {
      label: "🍽️ Eat a Home Cooked Meal",
      value: "eat_home",
      effects: { meal: 25, happiness: 5 },
    },
    {
      label: "🍳 Cook Omelette",
      value: "cook_meal",
      effects: {
        meal: 15,
        happiness: 10,
        sleep: -3,
        hygiene: -2,
      },
    },
    {
      label: "🧼 Clean the plate",
      value: "wash_dishes",
      effects: { hygiene: 5, sleep: -2 },
    },
  ],
};

export default function HomeScene({ onBack }) {
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

  const fastForward = () => {
    setActivityProgress(100);
  };

  const startActivity = (activity) => {
    setIsActivityActive(true);
    setCurrentActivity(activity);
    setActivityProgress(0); // mulai dari 0
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
    const zones = [spaceZone, yardZone, homeZone, kitchenZone];

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
            backgroundImage: `url(home.png)`,
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
                    nearZone == "yard"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${yardZone.x}%`,
            top: `${yardZone.y}%`,
            width: `${yardZone.width}%`,
            height: `${yardZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Yard</span>
        </div>

        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "home"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${homeZone.x}%`,
            top: `${homeZone.y}%`,
            width: `${homeZone.width}%`,
            height: `${homeZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Home</span>
        </div>

        <div
          className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "kitchen"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
          style={{
            left: `${kitchenZone.x}%`,
            top: `${kitchenZone.y}%`,
            width: `${kitchenZone.width}%`,
            height: `${kitchenZone.height}%`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <span>Kitchen</span>
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
          allZones={[yardZone, homeZone, kitchenZone, spaceZone]}
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
