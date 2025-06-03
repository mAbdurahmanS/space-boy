import React, { useState, useEffect, useRef } from "react";
import MovementControls from "./MovementControls";
import { useGame } from "../context/GameContext";
import { isPlayerNearZone } from "../utils/isPlayerNearZone";

function generateStars(ref, count = 60) {
  if (!ref.current) return;
  // Clean up old stars
  ref.current.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.width = star.style.height = `${1 + Math.random() * 2.5}px`;
    star.style.opacity = "" + (0.3 + Math.random() * 0.7);
    star.style.animationDuration = `${2 + Math.random()}s`;
    ref.current.appendChild(star);
  }
}

const homeZone = {
  id: "home",
  label: "🏠 Go to Home",
  x: 40,
  y: 40,
  width: 20,
  height: 20,
};
const beachZone = {
  id: "beach",
  label: "🏖️ Go to Beach",
  x: 75,
  y: 15,
  width: 20,
  height: 20,
};
const lakeZone = {
  id: "lake",
  label: "🌊 Go to Lake",
  x: 5,
  y: 15,
  width: 20,
  height: 20,
};
const templeZone = {
  id: "temple",
  label: "🧘‍♂️ Go to Temple",
  x: 5,
  y: 70,
  width: 20,
  height: 20,
};
const mountainZone = {
  id: "mountain",
  label: "⛰️ Go to Mountain",
  x: 75,
  y: 70,
  width: 20,
  height: 20,
};

export default function WorlMap({ onSelectArea }) {
  const {
    playerPosition,
    setPlayerPosition,
    isActivityActive,
    saveLastWorldPosition,
    setHistory,
  } = useGame();
  const [nearZone, setNearZone] = useState(null);
  const starsRef = useRef(null);
  const [locationLabel, setLocationLabel] = useState(null);
  const zones = [homeZone, beachZone, lakeZone, templeZone, mountainZone];

  useEffect(() => {
    const foundZone = zones.find((zone) =>
      isPlayerNearZone(playerPosition, zone)
    );
    if (foundZone) {
      setNearZone(foundZone.id);
      setLocationLabel(foundZone.label);
    } else {
      setNearZone(null);
      setLocationLabel(null);
    }
  }, [playerPosition]);

  useEffect(() => {
    generateStars(starsRef);
    const onResize = () => generateStars(starsRef);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative flex-1 rounded-xl shadow-xl overflow-hidden starry-bg border border-[#292979]">
      <div
        ref={starsRef}
        className="pointer-events-none absolute w-full h-full z-0"
      ></div>
      {/* Locations */}

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
                    nearZone == "lake"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
        style={{
          left: `${lakeZone.x}%`,
          top: `${lakeZone.y}%`,
          width: `${lakeZone.width}%`,
          height: `${lakeZone.height}%`,
          // transform: "translate(-50%, -50%)",
        }}
      >
        <span>Lake</span>
      </div>

      <div
        className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "temple"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
        style={{
          left: `${templeZone.x}%`,
          top: `${templeZone.y}%`,
          width: `${templeZone.width}%`,
          height: `${templeZone.height}%`,
          // transform: "translate(-50%, -50%)",
        }}
      >
        <span>Temple</span>
      </div>

      <div
        className={`absolute group select-none
                  rounded-4xl border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center bg-[#272868d9]
                  ${
                    nearZone == "beach"
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
        style={{
          left: `${beachZone.x}%`,
          top: `${beachZone.y}%`,
          width: `${beachZone.width}%`,
          height: `${beachZone.height}%`,
          // transform: "translate(-50%, -50%)",
        }}
      >
        <span>Beach</span>
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

      {/* Character */}
      <img
        src={`avatar1.png`}
        alt="Player Sprite"
        className="absolute z-50 object-contain"
        style={{
          left: `${playerPosition.x}%`,
          top: `${playerPosition.y}%`,
          transform: "translate(-50%, -50%)",
          width: "10%",
          height: "10%",
          imageRendering: "pixelated",
        }}
      />

      {/* Activity Button */}
      {nearZone && !isActivityActive && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => {
              saveLastWorldPosition(playerPosition);
              onSelectArea(nearZone);
              setPlayerPosition({ x: 50, y: 50 });
              setHistory((prev) => {
                if (!prev.areasVisited.includes(nearZone)) {
                  return {
                    ...prev,
                    areasVisited: [...prev.areasVisited, nearZone],
                  };
                }
                return prev;
              });
            }}
            className="bg-[#4361EE] hover:bg-[#513bfd] active:bg-[#451099] text-white px-5 py-3 mt-2 rounded-xl shadow-[0_0_14px_2px_#4361ee77] border border-[#7209B7] text-lg transition-all duration-150 hover:scale-105 animate-bounce cursor-pointer"
            style={{
              boxShadow:
                "0 0 36px #183c7b99, 0 0 12px #4685e8cc, 0 0 2px #4662fd",
              maxWidth: 380,
            }}
          >
            {locationLabel}
          </button>
        </div>
      )}
    </div>
  );
}
