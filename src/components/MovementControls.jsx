import React from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useGame } from "../context/GameContext";

const MovementControls = () => {
  const { playerPosition, setPlayerPosition } = useGame();

  const movePlayer = (direction) => {
    const moveAmount = 5;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case "up":
        newY = Math.max(0, playerPosition.y - moveAmount);
        break;
      case "down":
        newY = Math.min(100, playerPosition.y + moveAmount);
        break;
      case "left":
        newX = Math.max(0, playerPosition.x - moveAmount);
        break;
      case "right":
        newX = Math.min(100, playerPosition.x + moveAmount);
        break;
    }

    setPlayerPosition({ x: newX, y: newY });
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          movePlayer("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          movePlayer("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          movePlayer("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPosition]);

  return (
    <div className="">
      <div className="text-center text-white font-sci font-medium mb-2">
        Move
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => movePlayer("up")}
            className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
          >
            <span className="font-bold">↑</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => movePlayer("left")}
              className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
            >
              <span className="font-bold">←</span>
            </button>
            <button
              onClick={() => movePlayer("right")}
              className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
            >
              <span className="font-bold">→</span>
            </button>
          </div>
          <button
            onClick={() => movePlayer("down")}
            className="bg-[#4361EE] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition hover:bg-[#7209B7]"
          >
            <span className="font-bold">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementControls;
