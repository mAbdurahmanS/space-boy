import React from "react";

const GameStats = ({ playerName, avatarIndex }) => {
  const { stats } = useGame();

  const statItems = [
    { icon: "🍔", label: "Meal", value: stats.meal },
    { icon: "💤", label: "Sleep", value: stats.sleep },
    {
      icon: "🧼",
      label: "Hygiene",
      value: stats.cleanliness,
    },
    {
      icon: "😊",
      label: "Happy",
      value: stats.happiness,
    },
  ];

  return (
    <div className="w-full px-8 py-3 mb-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 bg-[#232263a8] shadow-[0_2px_24px_1px_#4b4af933] backdrop-blur-md border border-[#292979] animate-fade-in">
      <div className="flex items-center gap-4">
        <img
          src={`/avatar${avatarIndex + 1}.png`}
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
  );
};

export default GameStats;
