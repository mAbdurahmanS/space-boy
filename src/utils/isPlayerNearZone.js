/**
 * Mengecek apakah posisi player berada dekat atau di dalam zona.
 * @param {{x: number, y: number}} playerPosition - Posisi pemain.
 * @param {{x: number, y: number, width: number, height: number}} zone - Zona yang ingin dicek.
 * @param {number} [buffer=0] - Toleransi jarak di luar zona (default 0).
 * @returns {boolean} True jika pemain berada dalam zona + buffer.
 */
export function isPlayerNearZone(playerPosition, zone, buffer = 0) {
  const playerX = playerPosition.x;
  const playerY = playerPosition.y;

  const zoneLeft = zone.x;
  const zoneTop = zone.y;
  const zoneRight = zone.x + zone.width;
  const zoneBottom = zone.y + zone.height;

  const expandedLeft = zoneLeft - buffer;
  const expandedRight = zoneRight + buffer;
  const expandedTop = zoneTop - buffer;
  const expandedBottom = zoneBottom + buffer;

  return (
    playerX >= expandedLeft &&
    playerX <= expandedRight &&
    playerY >= expandedTop &&
    playerY <= expandedBottom
  );
}
