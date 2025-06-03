import React from "react";

export default function ActivityButtons({
  availableActivities,
  isActivityActive,
  hasItem,
  startActivity,
  allZones,
  playerStats,
  setHistory,
}) {
  if (availableActivities.length === 0 || isActivityActive) return null;

  const allActivities = allZones.flatMap((zone) => zone.activities);

  function isStatInsufficient(activity) {
    if (!activity.effects) return false;
    return Object.entries(activity.effects).some(([key, value]) => {
      const current = playerStats[key] ?? 0;
      return current + value < 0;
    });
  }

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex flex-col gap-2 items-center">
      {availableActivities.map((activity) => {
        const isOwned = activity.item && hasItem(activity.item.value);
        const isLocked =
          activity.requiredItem && !hasItem(activity.requiredItem);
        const requiredItemName =
          allActivities.find((act) => act.item?.value === activity.requiredItem)
            ?.item?.name || activity.requiredItem;

        return (
          <button
            key={activity.value}
            disabled={
              (isOwned && activity.item?.stackable !== true) ||
              isLocked ||
              isStatInsufficient(activity)
            }
            onClick={() => {
              startActivity(activity);
              setHistory((prev) => {
                if (!prev.activities.includes(activity.value)) {
                  return {
                    ...prev,
                    activities: [...prev.activities, activity.value],
                  };
                }
                return prev; // Tidak menambahkan jika sudah ada
              });

              if (activity.item) {
                setHistory((prev) => {
                  if (!prev.itemsCollected.includes(activity.item.value)) {
                    return {
                      ...prev,
                      itemsCollected: [
                        ...prev.itemsCollected,
                        activity.item.value,
                      ],
                    };
                  }
                  return prev;
                });
              }

              console.log(activity);
            }}
            className={`bg-[#4361EE] hover:bg-[#513bfd] active:bg-[#451099] text-white px-5 py-3 rounded-xl shadow-[0_0_14px_2px_#4361ee77] border border-[#7209B7] text-sm transition-all duration-150 hover:scale-105 animate-bounce cursor-pointer
              ${
                isOwned && activity.item?.stackable !== true
                  ? "opacity-80 pointer-events-none"
                  : ""
              }
              ${isLocked ? "opacity-80 pointer-events-none" : ""}
              ${
                isStatInsufficient(activity)
                  ? "opacity-80 pointer-events-none"
                  : ""
              }
            `}
            style={{
              boxShadow:
                "0 0 36px #183c7b99, 0 0 12px #4685e8cc, 0 0 2px #4662fd",
            }}
          >
            <span className="text-base font-bold">{activity.label}</span>

            {isLocked && (
              <div className="text-[10px] text-red-300 mt-1 font-semibold">
                Requires: {requiredItemName}
              </div>
            )}

            {isStatInsufficient(activity) && (
              <div className="text-[10px] text-red-300 mt-1 font-semibold">
                Not enough stat to perform
              </div>
            )}

            {isOwned && activity.removeItem && (
              <div className="text-[10px] text-green-400 mt-1 font-semibold">
                You can sell this item
              </div>
            )}

            <div className="text-xs text-[#60ffe4] mt-1 flex gap-2 flex-wrap justify-center">
              {activity.effects &&
                Object.entries(activity.effects).map(([key, value]) => (
                  <span key={`effect-${activity.value}-${key}`}>
                    {value >= 0 ? "+" : ""}
                    {value} {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                ))}

              {activity.item?.effects &&
                Object.entries(activity.item.effects).map(([key, value]) => (
                  <span key={`item-effect-${activity.value}-${key}`}>
                    {value >= 0 ? "+" : ""}
                    {value} {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
