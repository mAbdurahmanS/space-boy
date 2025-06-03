import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TIME_SPEED = 1000; // 1 second in real life = 1 minute in game
const INITIAL_STATUS = 50; // Initial value for all status bars
const INITIAL_MONEY = 1000; // Starting money
const STATUS_DECREASE_RATE = 0.1; // Status decrease per minute

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

// Dummy initial position
const charInit = { x: 50, y: 50 }; // In percent

const LOCATIONS = [
  { name: "Lake", x: 65, y: 20 },
  { name: "Beach", x: 80, y: 40 },
  { name: "Pantai", x: 15, y: 80 },
  { name: "Temple", x: 25, y: 75 },
  { name: "Mountain", x: 75, y: 85 },
];

export default function GameScreen({ playerName, avatarIndex, onGameOver }) {
  const gameLoopRef = useRef(null);
  const starsRef = useRef(null);
  const [charPos, setCharPos] = React.useState(charInit);

  const move = (dx, dy) =>
    setCharPos((pos) => ({
      x: Math.max(5, Math.min(95, pos.x + dx)),
      y: Math.max(5, Math.min(95, pos.y + dy)),
    }));

  const [status, setStatus] = useState({
    meal: INITIAL_STATUS,
    sleep: INITIAL_STATUS,
    hygiene: INITIAL_STATUS,
    happiness: INITIAL_STATUS,
  });

  const [money, setMoney] = useState(INITIAL_MONEY);
  const [gameTime, setGameTime] = useState({
    day: 1,
    hour: 8,
    minute: 0,
  });

  const updateGameTime = () => {
    setGameTime((prev) => {
      let minute = prev.minute + 1;
      let hour = prev.hour;
      let day = prev.day;

      if (minute >= 60) {
        minute = 0;
        hour++;
      }
      if (hour >= 24) {
        hour = 0;
        day++;
      }

      return { day, hour, minute };
    });
  };
  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };
  const getGreeting = () => {
    const hour = gameTime.hour;
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const LOCATIONS = [
    {
      id: "home",
      name: "Home",
      x: 50,
      y: 50,
      width: 20,
      height: 20,
    },
    {
      id: "beach",
      name: "Beach",
      x: 80,
      y: 20,
      width: 20,
      height: 20,
    },
    {
      id: "lake",
      name: "Lake",
      x: 20,
      y: 20,
      width: 20,
      height: 20,
    },
    {
      id: "temple",
      name: "Temple",
      x: 20,
      y: 80,
      width: 20,
      height: 20,
    },
    {
      id: "mountain",
      name: "Mountain",
      x: 80,
      y: 80,
      width: 20,
      height: 20,
    },
  ];

  const getMapColor = () => {
    const hour = gameTime.hour;

    if (hour >= 5 && hour < 12) return "#A8D5BA"; // Morning
    if (hour >= 12 && hour < 17) return "#9CD29C"; // Afternoon
    if (hour >= 17 && hour < 21) return "#5C8355"; // Evening
    return "#2E4A30"; // Night
  };

  const [currentLocation, setCurrentLocation] = useState("home");
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });

  const ACTIVITIES = {
    home: [
      {
        id: "sleep",
        name: "Take a Nap",
        effects: { sleep: 30 },
      },
      {
        id: "eat",
        name: "Eat a Home-Cooked Meal",
        effects: { meal: 25, happiness: 5 },
      },
      {
        id: "shower",
        name: "Take a Shower",
        effects: { hygiene: 30 },
      },
      {
        id: "do-chores",
        name: "Do Chores for Pocket Money",
        effects: { hygiene: -10, happiness: -5, money: 100 },
        explanation: "You found Rp 100 when helping clean the house.",
      },
    ],

    beach: [
      {
        id: "swim",
        name: "Swim in the Ocean",
        effects: { happiness: 20, hygiene: -15, sleep: -10 },
      },
      {
        id: "seafood",
        name: "Eat Fresh Seafood",
        effects: { meal: 30, happiness: 10, money: -50000 },
        explanation: "You spent Rp 50,000 on delicious seafood.",
      },
      {
        id: "buy-souvenirs",
        name: "Buy Beach Souvenirs",
        effects: { happiness: 15, money: -75000 },
        explanation:
          "You spent Rp 75,000 on beachside souvenirs and accessories.",
      },
      {
        id: "sunbathe",
        name: "Sunbathe",
        effects: { happiness: 10, sleep: -5, hygiene: -10 },
      },
    ],

    lake: [
      {
        id: "paddle-boat",
        name: "Paddle Boat Ride",
        effects: { happiness: 20, sleep: -10, money: -30000 },
        explanation: "You rented a paddle boat for Rp 30,000.",
      },
      {
        id: "picnic",
        name: "Picnic by the Lake",
        effects: { meal: 20, happiness: 15, money: -20000 },
        explanation: "You spent Rp 20,000 on snacks and drinks.",
      },
      {
        id: "feed-fish",
        name: "Feed the Fish",
        effects: { happiness: 10, money: -10000 },
        explanation: "You bought fish food for Rp 10,000.",
      },
      {
        id: "fishing",
        name: "Fishing Session",
        effects: { happiness: 15, meal: 10, sleep: -5 },
      },
    ],

    temple: [
      {
        id: "pray",
        name: "Join a Prayer Session",
        effects: { happiness: 25, sleep: -10 },
      },
      {
        id: "cleanse",
        name: "Spiritual Cleansing Ritual",
        effects: { hygiene: 20, happiness: 10, money: -30000 },
        explanation: "You gave Rp 30,000 as a donation for the ritual.",
      },
      {
        id: "buy-incense",
        name: "Buy Incense & Offerings",
        effects: { happiness: 10, money: -20000 },
        explanation: "You purchased offerings for Rp 20,000.",
      },
      {
        id: "volunteer",
        name: "Volunteer to Help Monks",
        effects: { hygiene: -10, happiness: 20, money: 50000 },
        explanation: "You received Rp 50,000 in appreciation from the monks.",
      },
    ],

    mountain: [
      {
        id: "hike",
        name: "Go for a Hike",
        effects: { happiness: 30, sleep: -20, hygiene: -15 },
      },
      {
        id: "camp",
        name: "Set Up Camp and Rest",
        effects: { sleep: 25, meal: -10, hygiene: -5, money: -40000 },
        explanation: "You spent Rp 40,000 on firewood and camp supplies.",
      },
      {
        id: "buy-local-goods",
        name: "Buy Local Goods",
        effects: { happiness: 10, money: -60000 },
        explanation: "You bought handmade crafts for Rp 60,000.",
      },
      {
        id: "photograph",
        name: "Take Landscape Photos",
        effects: { happiness: 20, sleep: -5 },
      },
    ],
  };

  const movePlayer = (direction) => {
    setPlayerPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      const step = 5;

      if (direction === "up") newY = Math.max(0, prev.y - step);
      if (direction === "down") newY = Math.min(100, prev.y + step);
      if (direction === "left") newX = Math.max(0, prev.x - step);
      if (direction === "right") newX = Math.min(100, prev.x + step);

      // Check proximity to location
      const near = LOCATIONS.find((loc) => {
        const dx = loc.x - newX;
        const dy = loc.y - newY;
        return Math.sqrt(dx * dx + dy * dy) < 10;
      });

      if (near) setCurrentLocation(near.id);

      return { x: newX, y: newY };
    });
  };

  const performActivity = (activity) => {
    if (!activity) return;

    // Check for money
    const cost = activity.effects.money ?? 0;
    if (money + cost < 0) return; // not enough money

    // Apply money effect
    if (cost !== 0) {
      setMoney((prevMoney) => prevMoney + cost);
    }

    // Apply other status effects
    setStatus((prev) => {
      const updated = { ...prev };
      Object.entries(activity.effects).forEach(([key, value]) => {
        if (key !== "money" && updated[key] !== undefined) {
          updated[key] = Math.max(0, Math.min(100, updated[key] + value));
        }
      });
      return updated;
    });
  };

  // Decrease status every tick
  const decreaseStatus = () => {
    setStatus((prev) => {
      const updated = {
        meal: Math.max(0, prev.meal - STATUS_DECREASE_RATE),
        sleep: Math.max(0, prev.sleep - STATUS_DECREASE_RATE),
        hygiene: Math.max(0, prev.hygiene - STATUS_DECREASE_RATE),
        happiness: Math.max(0, prev.happiness - STATUS_DECREASE_RATE * 0.5),
      };

      if (updated.meal === 0) {
        onGameOver("You died of hunger.");
      } else if (updated.sleep === 0) {
        onGameOver("You died of exhaustion.");
      } else if (updated.hygiene === 0) {
        onGameOver("You died of disease.");
      } else if (updated.happiness === 0) {
        onGameOver("You died of depression.");
      }

      return updated;
    });
  };

  // Setup game loop (clock + status drain)
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      updateGameTime();
      decreaseStatus();
    }, TIME_SPEED);

    return () => clearInterval(gameLoopRef.current);
  }, []);

  // Keyboard movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer("up");
          break;
        case "ArrowDown":
          movePlayer("down");
          break;
        case "ArrowLeft":
          movePlayer("left");
          break;
        case "ArrowRight":
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    generateStars(starsRef);
    // re-generate stars on resize for responsiveness
    const onResize = () => generateStars(starsRef);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [nearZone, setNearZone] = useState(null);
  const [activityProgress, setActivityProgress] = useState(0);
  const [isActivityActive, setIsActivityActive] = useState(false);

  const isNearZone = (zone) => {
    const dx = playerPosition.x - zone.x;
    const dy = playerPosition.y - zone.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 8; // karena semua pakai persen, sesuaikan toleransi
  };

  useEffect(() => {
    const found = LOCATIONS.find((zone) => isNearZone(zone));
    setNearZone(found?.id || null);
  }, [playerPosition]);

  const startActivity = (activity) => {
    setIsActivityActive(true);
    setActivityProgress(0);

    const interval = setInterval(() => {
      setActivityProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsActivityActive(false);

          // if (activity === 'swim') {
          //   updateStats({ happiness: 95, cleanliness: 100 });
          // } else if (activity === 'coconut') {
          //   updateStats({ meal: 90, money: 140 });
          // }

          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const fastForward = () => {
    setActivityProgress(100);
  };

  const locationLabel = {
    home: "🏠 Enter Home",
    beach: "🏊‍♂️ Enter Beach",
    lake: "🛶 Enter Lake",
    temple: "🧘‍♂️ Enter Temple",
    mountain: "⛰️ Enter Mountain",
  };

  console.log(nearZone);

  return (
    <>
      {/* Wrapper: Full Screen */}
      <div className="flex flex-col h-svh font-['Orbitron'] bg-[#070F2B] text-[#F8EDFF]">
        {/* 🟦 Status Bar */}
        <div className="bg-[#1B1A55] p-4 shadow-lg h-min">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 h-full">
            {/* Player Info + Time */}
            <div className="flex justify-between items-center md:items-start md:gap-4">
              <div className="flex items-center gap-3 w-max">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#525CEB] bg-white shrink-0">
                  <img
                    src={`avatar${avatarIndex + 1}.png`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">
                    {playerName}
                  </h2>
                  <p className="text-xs text-[#BFCFE7]">{getGreeting()}</p>
                </div>
              </div>

              <div className="text-right text-xs md:text-sm md:min-w-[120px]">
                <p className="text-[#BFCFE7]">Day {gameTime.day}</p>
                <p className="text-sm font-bold">
                  {formatTime(gameTime.hour, gameTime.minute)}
                </p>
                <p className="font-semibold mt-0.5">
                  Rp {money.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Status Bars */}
            <div className="flex flex-wrap justify-between md:gap-2 w-full">
              {Object.entries(status).map(([key, value]) => (
                <div key={key} className="w-[48%] md:flex-1">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="capitalize">{key}</span>
                    <span>{Math.round(value)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#535C91] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#525CEB] transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🗺️ Game Map (Dynamic Grass Background) */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* 🗺️ Game Map (left on desktop, top on mobile) */}
          <div className="flex justify-center items-center md:w-[66%] w-full h-[auto]">
            <div
              className="w-full h-full relative starry-bg"
              style={
                {
                  // aspectRatio: "1440 / 1464",
                  // backgroundColor: getMapColor(),
                  // backgroundImage: `url(/selectionbackground.jpg)`,
                  // backgroundSize: "cover",
                  // backgroundPosition: "center",
                  // transition: "background-color 0.5s ease",
                }
              }
            >
              <div
                ref={starsRef}
                className="pointer-events-none absolute w-full h-full z-0"
              ></div>
              {/* Locations */}
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.id}
                  className={`absolute rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold 
              ${currentLocation === loc.id ? "bg-[#525CEB]" : "bg-[#1B1A55]"} 
              text-[#F8EDFF] border-2 border-[#F8EDFF] shadow`}
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "6%",
                    height: "6%",
                  }}
                >
                  {loc.name}
                </div>
              ))}

              {/* Player */}
              <img
                src={`avatar${avatarIndex + 1}.png`}
                alt="Player Sprite"
                className="absolute z-10 object-contain"
                style={{
                  left: `${playerPosition.x}%`,
                  top: `${playerPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "10%",
                  height: "10%",
                  imageRendering: "pixelated",
                }}
              />
            </div>
          </div>

          {/* 🧃 Activities Panel (right on desktop, bottom on mobile) */}
          <div className="w-full md:w-[34%] max-h-full p-4 overflow-y-auto bg-[#1B1A55] border-l border-[#535C91]">
            <h3 className="text-lg font-bold mb-3">
              {LOCATIONS.find((loc) => loc.id === currentLocation)?.name} –
              Activities
            </h3>

            <div className="flex flex-col gap-3">
              {ACTIVITIES[currentLocation]?.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => performActivity(activity)}
                  className="bg-[#525CEB] text-[#F8EDFF] hover:bg-[#F8E559] hover:text-[#070F2B] 
                             border border-[#F8EDFF] rounded-md px-3 py-2 text-xs transition-all 
                             cursor-pointer leading-tight flex flex-col gap-1"
                >
                  <div className="font-semibold uppercase truncate">
                    {activity.name}
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px]">
                    {Object.entries(activity.effects).map(([key, value]) => (
                      <span key={key}>
                        {key === "money"
                          ? `${value < 0 ? "-" : "+"}Rp ${Math.abs(
                              value
                            ).toLocaleString()}`
                          : `${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                              value > 0 ? "+" : ""
                            }${value}%`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col items-center gap-1 text-[#F8EDFF]">
              <h2 className="text-xs font-semibold text-center text-[#BFCFE7] mb-1">
                Move
              </h2>
              <div className="grid grid-cols-3 gap-1">
                <div></div>
                <button
                  onClick={() => movePlayer("up")}
                  className="bg-[#525CEB] hover:bg-[#F8E559] hover:text-[#070F2B] rounded px-2 py-1 text-xs font-bold"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <div></div>

                <button
                  onClick={() => movePlayer("left")}
                  className="bg-[#525CEB] hover:bg-[#F8E559] hover:text-[#070F2B] rounded px-2 py-1 text-xs font-bold"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer("right")}
                  className="bg-[#525CEB] hover:bg-[#F8E559] hover:text-[#070F2B] rounded px-2 py-1 text-xs font-bold"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div></div>
                <button
                  onClick={() => movePlayer("down")}
                  className="bg-[#525CEB] hover:bg-[#F8E559] hover:text-[#070F2B] rounded px-2 py-1 text-xs font-bold"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-2 font-['Orbitron'] bg-gradient-to-b from-[#150c3f] via-[#191a43] to-[#07072c] flex flex-col font-sci">
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
              {Object.entries(status).map(([key, value]) => (
                <div key={key} className="w-full">
                  <div className="flex items-center gap-2">
                    {/* <span>{item.icon}</span> */}
                    <span className="text-xs font-bold capitalize">{key}</span>
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
                {money.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
          {/* BOARD MAP */}
          <div className="relative flex-1 rounded-xl shadow-xl overflow-hidden starry-bg min-h-[480px] max-h-[590px] border border-[#292979]">
            <div
              ref={starsRef}
              className="pointer-events-none absolute w-full h-full z-0"
            ></div>
            {/* Locations */}
            {LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className={`absolute z-20 group select-none
                  rounded-full border-4
                  text-white text-lg shadow-xl text-center flex items-center justify-center
                  ${
                    nearZone == loc.id
                      ? "scale-110 border-[#7209B7] shadow-[0_0_24px_2px_#7209B7aa]"
                      : "bg-[#272868d9] border-[#4361EE]"
                  } 
                  transition-all duration-200 ease-in-out
                  `}
                style={{
                  left: `calc(${loc.x}% - 55px)`,
                  top: `calc(${loc.y}% - 32px)`,
                  width: loc.width + "%",
                  height: loc.height + "%",
                }}
              >
                <span>{loc.name}</span>
              </div>
            ))}

            {/* Character */}
            <img
              src={`avatar${avatarIndex + 1}.png`}
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
              <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-30">
                <button
                  onClick={() => startActivity(nearZone)}
                  className="bg-[#4361EE] hover:bg-[#513bfd] active:bg-[#451099] text-white px-5 py-3 mt-2 rounded-xl shadow-[0_0_14px_2px_#4361ee77] border border-[#7209B7] text-lg transition-all duration-150 hover:scale-105 animate-bounce cursor-pointer"
                  style={{
                    boxShadow:
                      "0 0 36px #183c7b99, 0 0 12px #4685e8cc, 0 0 2px #4662fd",
                    maxWidth: 380,
                  }}
                >
                  {locationLabel[nearZone] || "Enter Area"}
                </button>
              </div>
            )}

            {/* Activity Progress */}
            {isActivityActive && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border-4 border-blue-400">
                  <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">
                    {nearZone === "swim" ? "🏊‍♂️ Berenang" : "🥥 Minum Kelapa"}
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
                      size="sm"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white font-bold px-4 py-2 rounded-xl shadow-lg"
                    >
                      {/* <FastForward size={18} className="mr-2" /> */}
                      Fast Forward
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PANEL AKSI */}
          <div
            className="
            w-full max-w-md min-h-[420px] bg-gradient-to-br from-[#232263ee] to-[#401a759a] rounded-2xl
            shadow-[0_1px_30px_2px_#7c73f966] flex flex-col p-6 gap-6 border border-[#444195] backdrop-blur-md"
          >
            <div>
              <h2 className="text-xl text-[#4361EE] font-extrabold tracking-widest font-sci mb-2">
                Home – Activities
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <button className="bg-[#3c38a3db] border border-[#4361EE] font-sci text-white rounded-lg text-lg py-3 px-4 hover:bg-[#4361EE] hover:shadow-[0_0_24px_2px_#4361EE] transition-all flex justify-between items-center group">
                <span>Take a Nap</span>
                <span className="ml-2 text-[#48d0ff] text-xs group-hover:text-white transition">
                  Sleep: +36%
                </span>
              </button>
              <button className="bg-[#3c38a3db] border border-[#4361EE] font-sci text-white rounded-lg text-lg py-3 px-4 hover:bg-[#4361EE] hover:shadow-[0_0_24px_2px_#4361EE] transition-all flex justify-between items-center group">
                <span>Eat a Home-cooked Meal</span>
                <span className="ml-2 text-[#fa90ff] text-xs group-hover:text-white transition">
                  Meal: +25% | Happiness: +5%
                </span>
              </button>
              <button className="bg-[#3c38a3db] border border-[#4361EE] font-sci text-white rounded-lg text-lg py-3 px-4 hover:bg-[#4361EE] hover:shadow-[0_0_24px_2px_#4361EE] transition-all flex justify-between items-center group">
                <span>Take a Shower</span>
                <span className="ml-2 text-[#58d8ff] text-xs group-hover:text-white transition">
                  Hygiene: +30%
                </span>
              </button>
              <button className="bg-[#3c38a3db] border border-[#4361EE] font-sci text-white rounded-lg text-lg py-3 px-4 hover:bg-[#4361EE] hover:shadow-[0_0_24px_2px_#4361EE] transition-all flex justify-between items-center group">
                <span>Do Chores for Pocket Money</span>
                <span className="ml-2 text-[#e4d750] text-xs group-hover:text-white transition">
                  Hygiene: -12% | Happiness: -5% | Rp +100
                </span>
              </button>
            </div>
            <div className="mt-8">
              <div className="text-center text-white font-sci font-medium mb-2">
                Move
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => move(0, -8)}
                    className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
                  >
                    <span className="font-bold">↑</span>
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => move(-8, 0)}
                      className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
                    >
                      <span className="font-bold">←</span>
                    </button>
                    <button
                      onClick={() => move(8, 0)}
                      className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
                    >
                      <span className="font-bold">→</span>
                    </button>
                  </div>
                  <button
                    onClick={() => move(0, 8)}
                    className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
                  >
                    <span className="font-bold">↓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
