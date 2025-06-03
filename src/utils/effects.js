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
