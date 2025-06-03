import React from "react";

export default function StartScreen({ onStart, onViewMembers }) {
  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center text-[#F8EDFF] font-['Orbitron'] px-4 py-8 bg-cover bg-center"
      style={{
        backgroundImage: "url('/startbackground.jpg')",
      }}
    >
      {/* Top spacing */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl text-center font-bold tracking-widest mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          🚀 UMN - Ucup Menjelajah Nusantara 🚀
        </h1>

        {/* Buttons */}
        <div className="flex flex-col gap-6 items-center mb-12">
          <button
            onClick={onStart}
            className="button px-10 py-4 rounded-lg bg-[#525CEB] text-[#F8EDFF] text-lg uppercase font-bold tracking-widest 
                       border-4 border-[#1B1A55] shadow-[0_0_16px_#525CEB] 
                       hover:bg-[#6B78F2] hover:text-[#070F2B] transition-all duration-300"
          >
            Start Game
          </button>

          <button
            onClick={onViewMembers}
            className="button px-10 py-3 rounded-lg bg-[#535C91] text-[#F8EDFF] text-lg uppercase font-semibold tracking-widest 
                       border-4 border-[#525CEB] shadow-[0_0_10px_#BFCFE7] 
                       hover:bg-[#1B1A55] hover:text-[#070F2B] transition-all duration-300"
          >
            View Members
          </button>
        </div>
      </div>

      {/* Footer fixed at bottom */}
      <footer className="text-sm text-[#BFCFE7] mt-auto">
        Created by{" "}
        <span className="text-[#525CEB] font-semibold">Team Spaceboy</span>
      </footer>
    </div>
  );
}
