import React from "react";

const teamMembers = [
  {
    name: "Muhamad Zhaky Alamsyah",
    studentId: "00000130569",
    photo: "/Zhaky.jpg",
  },
  {
    name: "Haikal Budiawan",
    studentId: "00000133638",
    photo: "Haikal.jpg",
  },
  {
    name: "Khairiansyah Hafizh",
    studentId: "00000128661",
    photo: "/Hafizh.jpg",
  },
  // Add more team members as needed
];

export default function MemberScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-[#070F2B] text-[#F8EDFF] font-['Orbitron'] p-6">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="button text-[#F8EDFF] border border-[#525CEB] px-4 py-2 rounded hover:bg-[#525CEB] hover:text-[#070F2B]"
        >
          Back
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-grow">
          Team Members
        </h1>
        <div className="w-[64px]" /> {/* Placeholder to center title */}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center mb-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-[#1B1A55] border-4 border-[#525CEB] shadow-[0_0_12px_#525CEB] rounded-2xl p-4 w-full max-w-[280px] text-center"
          >
            <div className="relative w-full aspect-[3/4] mb-4 border-4 border-[#F8EDFF] rounded-lg overflow-hidden shadow-lg">
              <img
                src={member.photo}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold">{member.name}</h2>
            <p className="text-sm text-[#BFCFE7]">{member.studentId}</p>
          </div>
        ))}
      </div>
      <footer className="text-sm text-[#BFCFE7] mt-auto">
        Created by{" "}
        <span className="text-[#525CEB] font-semibold">Team Spaceboy</span>
      </footer>
    </div>
  );
}
