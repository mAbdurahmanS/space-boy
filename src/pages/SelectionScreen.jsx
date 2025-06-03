import React, { useState } from "react";
import { useGame } from "../context/GameContext";

const avatars = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

export default function SelectionScreen({ onStartGame, onNavigateToStart }) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [error, setError] = useState("");
  const { setIsGameStarted } = useGame();

  const handleStartGame = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    onStartGame(name, selectedAvatar);
    setIsGameStarted(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/selectionbackground.jpg')",
      }}
    >
      <header className="w-svw flex justify-between items-center md:relative md:justify-start py-4 px-8 mb-4">
        <button
          onClick={onNavigateToStart}
          className="button h-fit w-fit text-[#F8EDFF]"
        >
          Back
        </button>
        <h1 className="audiowide lg:absolute lg:top-1/2 lg:left-1/2 lg:translate-[-50%] w-max text-[#F8EDFF]">
          UMN - Ucup Menjelajah Nusantara
        </h1>
      </header>

      <div className="md:px-6">
        {/* Name Input */}
        <div
          className="flex flex-col items-center gap-4 p-6 font-['Orbitron']"
          style={{ color: "#F8EDFF" }}
        >
          <label
            htmlFor="playerName"
            className="text-lg uppercase tracking-widest px-4 py-1 border-b-4"
            style={{ borderColor: "#525CEB" }}
          >
            Enter Your Name
          </label>
          <input
            id="playerName"
            type="text"
            placeholder="PLAYER 1"
            className="w-min text-center text-xl px-4 py-2 outline-none tracking-widest border-4 focus:ring-4 transition-all"
            style={{
              backgroundColor: "#1F2544",
              color: "#F8EDFF",
              borderColor: "#1B1A55",
              boxShadow: "0 0 0 4px #1B1A55, inset 0 0 8px #525CEB",
            }}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Avatar Selection */}
        <div className="flex flex-wrap justify-center gap-4 md:flex-1">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              onClick={() => setSelectedAvatar(index)}
              className={`p-6 sm:p-8 rounded-2xl w-52 sm:w-60 md:w-72 text-center cursor-pointer transition-all font-['Orbitron'] ${
                selectedAvatar === index
                  ? "shadow-[0_0_24px_#525CEB]"
                  : "hover:scale-105 shadow-[0_0_16px_#525CEB]"
              }`}
              style={{
                backgroundColor:
                  selectedAvatar === index ? "#525CEB" : "#1B1A55",
                border: "4px solid",
                borderColor: selectedAvatar === index ? "#1B1A55" : "#525CEB",
                color: "#F8EDFF",
              }}
            >
              <img
                src={`avatar${index + 1}.png`}
                alt={`Avatar ${index + 1}`}
                className="w-32 sm:w-36 md:w-40 h-auto mx-auto mb-4 rounded-full border-2"
                style={{
                  borderColor: "#070F2B",
                  imageRendering: "pixelated",
                }}
              />
              <p className="uppercase text-base sm:text-lg tracking-widest">{`Astro ${
                index + 1
              }`}</p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          className="button mt-6 px-8 py-3 rounded-lg text-lg uppercase tracking-widest font-['Orbitron'] border-4 transition-all duration-300"
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
          onClick={handleStartGame}
        >
          Start Adventure
        </button>
      </div>
    </div>
  );
}
