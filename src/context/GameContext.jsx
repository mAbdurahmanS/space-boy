import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const GameContext = createContext(undefined);
const TIME_SPEED = 1000;
const STATUS_DECREASE_RATE = 0.1;

export const GameProvider = ({ children }) => {
  const gameLoopRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [isActivityActive, setIsActivityActive] = useState(false);
  const [gameTime, setGameTime] = useState({ day: 1, hour: 8, minute: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [stats, setStats] = useState({
    meal: 80,
    sleep: 70,
    happiness: 90,
    hygiene: 85,
    money: 150,
    inventory: [],
  });

  const [history, setHistory] = useState({
    activities: [],
    itemsCollected: [],
    itemsUsed: [],
    areasVisited: [],
  });

  console.log(stats);
  console.log(history);

  const [lastWorldPosition, setLastWorldPosition] = useState(null);

  const saveLastWorldPosition = (pos) => {
    setLastWorldPosition(pos);
  };

  const restoreLastWorldPosition = () => {
    if (lastWorldPosition) setPlayerPosition(lastWorldPosition);
  };

  const updateStats = (effects) => {
    if (!effects) return;
    setStats((prev) => {
      const updated = { ...prev };
      for (const key in effects) {
        if (key in updated && typeof updated[key] === "number") {
          if (key === "money") {
            updated[key] = Math.max(0, updated[key] + effects[key]);
          } else {
            updated[key] = Math.min(
              100,
              Math.max(0, updated[key] + effects[key])
            );
          }
        }
      }
      return updated;
    });
  };

  // Cek apakah inventory punya item tertentu
  const hasItem = (itemValue, minQuantity = 1) => {
    const item = stats.inventory.find((invItem) => invItem.value === itemValue);
    return item && (item.quantity || 1) >= minQuantity;
  };

  const addItem = (item, amount = 1) => {
    setStats((prev) => {
      const existingItemIndex = prev.inventory.findIndex(
        (invItem) => invItem.value === item.value
      );

      const canHaveMultiple = !!item.effects; // Item dengan efek bisa stack

      if (existingItemIndex !== -1) {
        if (!canHaveMultiple) {
          // Item tanpa efek, sudah ada, jangan tambah
          // console.log("Item exists but cannot stack:", item.value);
          return prev;
        }

        // Item punya efek, tambah quantity
        const updatedInventory = [...prev.inventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity:
            (updatedInventory[existingItemIndex].quantity || 1) + amount,
        };
        // console.log(
        //   "Item quantity updated:",
        //   updatedInventory[existingItemIndex]
        // );
        return { ...prev, inventory: updatedInventory };
      } else {
        // Item belum ada, tambahkan baru dengan quantity amount
        // console.log("New item added:", item.value);
        return {
          ...prev,
          inventory: [...prev.inventory, { ...item, quantity: amount }],
        };
      }
    });
  };

  const removeItem = (itemValue, amount = 1) => {
    setStats((prev) => {
      const existingIndex = prev.inventory.findIndex(
        (i) => i.value === itemValue
      );
      if (existingIndex === -1) return prev;

      const newInventory = [...prev.inventory];
      const currentQty = newInventory[existingIndex].quantity || 1;

      if (currentQty <= amount) {
        // Hapus item dari inventory
        newInventory.splice(existingIndex, 1);
      } else {
        // Kurangi quantity
        newInventory[existingIndex] = {
          ...newInventory[existingIndex],
          quantity: currentQty - amount,
        };
      }

      return { ...prev, inventory: newInventory };
    });
  };

  const handleUseItem = (item) => {
    const updatedInventory = stats.inventory
      .map((invItem) => {
        if (invItem.value === item.value) {
          return {
            ...invItem,
            quantity: invItem.quantity - 1,
          };
        }
        return invItem;
      })
      .filter((i) => i.quantity > 0);

    const newStats = { ...stats };

    const cappedStats = ["meal", "happiness", "hygiene", "sleep"];

    if (item.effects) {
      for (const [key, value] of Object.entries(item.effects)) {
        if (key in newStats) {
          const updatedValue = newStats[key] + value;
          newStats[key] = cappedStats.includes(key)
            ? Math.min(updatedValue, 100)
            : updatedValue;
        }
      }
    }

    setStats({
      ...newStats,
      inventory: updatedInventory,
    });

    setHistory((prev) => {
      if (!prev.itemsUsed.includes(item.value)) {
        return {
          ...prev,
          itemsUsed: [...prev.itemsUsed, item.value],
        };
      }
      return prev;
    });
  };

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

  const decreaseStatus = () => {
    setStats((prev) => ({
      ...prev,
      meal: Math.max(0, prev.meal - STATUS_DECREASE_RATE),
      sleep: Math.max(0, prev.sleep - STATUS_DECREASE_RATE),
      hygiene: Math.max(0, prev.hygiene - STATUS_DECREASE_RATE),
      happiness: Math.max(0, prev.happiness - STATUS_DECREASE_RATE * 0.5),
    }));
  };

  const getFinalScore = () => {
    return (
      history.activities.length +
      history.itemsCollected.length +
      history.itemsUsed.length +
      history.areasVisited.length * 2 // misalnya area bernilai lebih tinggi
    );
  };

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    gameLoopRef.current = setInterval(() => {
      updateGameTime();
      decreaseStatus();
    }, TIME_SPEED);

    return () => clearInterval(gameLoopRef.current);
  }, [isGameStarted, isGameOver]);

  return (
    <GameContext.Provider
      value={{
        stats,
        updateStats,
        playerPosition,
        setPlayerPosition,
        isActivityActive,
        setIsActivityActive,
        gameTime,
        formatTime,
        getGreeting,
        addItem,
        hasItem,
        removeItem,
        handleUseItem,
        saveLastWorldPosition,
        restoreLastWorldPosition,
        gameLoopRef,
        history,
        setHistory,
        getFinalScore,
        isGameOver,
        setIsGameOver,
        isGameStarted,
        setIsGameStarted,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
