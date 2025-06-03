import React from "react";
import { useGame } from "../context/GameContext";

export default function GameOverScreen({ reason, onRestart }) {
  const { stats, history } = useGame();

  const calculateLifeSatisfactionScore = () => {
    let score = 0;
    let breakdown = {
      statBalance: 0,
      activities: 0,
      items: 0,
      areaVariety: 0,
    };

    // 1. Stat Balance (max 40 points)
    const statValues = Object.entries(stats)
      .filter(([key]) => key !== "money" && key !== "inventory")
      .map(([, value]) => value);

    const avgStat = statValues.reduce((a, b) => a + b, 0) / statValues.length;
    const statVariance =
      statValues.reduce((acc, val) => acc + Math.pow(val - avgStat, 2), 0) /
      statValues.length;
    const balanceScore = Math.max(0, 40 - statVariance / 10);
    breakdown.statBalance = Math.round(balanceScore);
    score += breakdown.statBalance;

    // 2. Activities Performed (max 30 points)
    breakdown.activities = Math.min(30, history.activities.length * 2);
    score += breakdown.activities;

    // 3. Items Collected and Used (max 20 points)
    const itemScore =
      history.itemsCollected.length * 1.5 + history.itemsUsed.length * 2;
    breakdown.items = Math.min(20, Math.round(itemScore));
    score += breakdown.items;

    // 4. Area Variety (max 10 points)
    breakdown.areaVariety = Math.min(10, history.areasVisited.length * 2);
    score += breakdown.areaVariety;

    return {
      total: Math.round(score),
      breakdown,
      rating: getLifeRating(score),
    };
  };

  const getLifeRating = (score) => {
    if (score >= 90)
      return {
        text: "Extraordinary Life!",
        emoji: "🌟",
        color: "text-yellow-300",
      };
    if (score >= 80)
      return { text: "Fulfilling Life", emoji: "😊", color: "text-green-300" };
    if (score >= 70)
      return { text: "Good Life", emoji: "🙂", color: "text-blue-300" };
    if (score >= 60)
      return { text: "Balanced Life", emoji: "😐", color: "text-purple-300" };
    if (score >= 50)
      return { text: "Average Life", emoji: "😔", color: "text-orange-300" };
    return { text: "Needs Improvement", emoji: "😢", color: "text-red-300" };
  };

  const scoreData = calculateLifeSatisfactionScore();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#0a0625] via-[#1a0d47] to-[#0d1442] starry-bg py-8">
      {/* Stars Background */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random()}s`,
          }}
        />
      ))}
      {/* Header */}
      <header className=" w-full flex justify-center items-center px-8 py-4 mb-10">
        <h1 className="audiowide text-lg sm:text-xl md:text-2xl lg:text-3xl">
          UMN - Ucup Menjelajah Nusantara
        </h1>
      </header>

      <div className="max-w-2xl">
        <div
          className="bg-gradient-to-br from-[#0a0625] via-[#1a0d47] to-[#0d1442] border-2 border-[#4361EE] shadow-[0_0_50px_10px_rgba(67,97,238,0.3)] rounded-3xl p-8 backdrop-blur-md animate-fade-in"
          style={{
            boxShadow:
              "0 0 60px rgba(67,97,238,0.4), 0 0 30px rgba(114,9,183,0.3), inset 0 0 30px rgba(67,97,238,0.1)",
          }}
        >
          <div className="text-center">
            <h1 className="text-[#4361EE] text-5xl mb-4 tracking-widest font-bold drop-shadow-[0_0_10px_rgba(67,97,238,0.8)]">
              Game Over
            </h1>

            <p className="text-[#a8d1ff] mb-8 text-lg">
              Your life journey has ended. Here's your Life Satisfaction Score:
            </p>

            <div className="bg-gradient-to-r from-[#4361EE]/20 to-[#7209B7]/20 rounded-2xl p-8 mb-8 border border-[#4361EE]/50">
              <div className="text-8xl font-bold text-[#70e0d7] mb-4">
                {scoreData.total}
              </div>
              <div
                className={`text-3xl font-bold ${scoreData.rating.color} mb-2`}
              >
                {scoreData.rating.emoji} {scoreData.rating.text}
              </div>
              <div className="text-lg text-[#a8d1ff]/80">out of 100 points</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#232263a8] rounded-xl p-4 border border-[#292979]">
                <div className="text-2xl font-bold text-[#70e0d7]">
                  {scoreData.breakdown.statBalance}
                </div>
                <div className="text-sm text-[#a8d1ff]">Stat Balance</div>
              </div>
              <div className="bg-[#232263a8] rounded-xl p-4 border border-[#292979]">
                <div className="text-2xl font-bold text-[#70e0d7]">
                  {scoreData.breakdown.activities}
                </div>
                <div className="text-sm text-[#a8d1ff]">Activities</div>
              </div>
              <div className="bg-[#232263a8] rounded-xl p-4 border border-[#292979]">
                <div className="text-2xl font-bold text-[#70e0d7]">
                  {scoreData.breakdown.items}
                </div>
                <div className="text-sm text-[#a8d1ff]">Items</div>
              </div>
              <div className="bg-[#232263a8] rounded-xl p-4 border border-[#292979]">
                <div className="text-2xl font-bold text-[#70e0d7]">
                  {scoreData.breakdown.areaVariety}
                </div>
                <div className="text-sm text-[#a8d1ff]">Area Variety</div>
              </div>
            </div>

            <div className="text-left text-base text-[#a8d1ff] mb-8 space-y-2 bg-[#232263a8] rounded-xl p-6 border border-[#292979]">
              <div className="text-center text-lg font-bold text-[#70e0d7] mb-4">
                Game Statistics
              </div>
              <div>
                📊 Activities Performed:{" "}
                <span className="text-[#70e0d7] font-bold">
                  {history.activities.length}
                </span>
              </div>
              <div>
                🎒 Items Collected:{" "}
                <span className="text-[#70e0d7] font-bold">
                  {history.itemsCollected.length}
                </span>
              </div>
              <div>
                🔧 Items Used:{" "}
                <span className="text-[#70e0d7] font-bold">
                  {history.itemsUsed.length}
                </span>
              </div>
              <div>
                🗺️ Areas Visited:{" "}
                <span className="text-[#70e0d7] font-bold">
                  {history.areasVisited.join(", ")}
                </span>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="cursor-pointer w-full py-6 px-8 rounded-xl bg-gradient-to-r from-[#4361EE]/40 to-[#7209B7]/40 border border-[#4361EE] text-white font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(67,97,238,0.5)] backdrop-blur-sm"
              style={{
                boxShadow: "0 0 15px rgba(67,97,238,0.3)",
              }}
            >
              Start New Life
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Text */}
      {/* <div className="p-8 font-['Orbitron']">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-4 tracking-widest text-red-500 drop-shadow-[0_0_10px_red]">
          GAME OVER
        </h2>
        <p className="text-xl sm:text-2xl mb-8 tracking-wider">Testing</p>

        <button
          onClick={onRestart}
          className="button mt-4 px-8 py-3 rounded-lg text-lg uppercase tracking-widest font-['Orbitron'] border-4 transition-all duration-300"
          style={{
            backgroundColor: "#525CEB",
            color: "#1B1A55",
            borderColor: "#1B1A55",
            boxShadow: "0 0 16px #525CEB",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFD700";
            e.currentTarget.style.color = "#070F2B";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#525CEB";
            e.currentTarget.style.color = "#1B1A55";
          }}
        >
          Restart Adventure
        </button>
      </div> */}
    </div>
  );
}
