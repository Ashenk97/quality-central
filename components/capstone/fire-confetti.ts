import confetti from "canvas-confetti"

export function fireCapstoneConfetti() {
  const durationMs = 4000
  const animationEnd = Date.now() + durationMs
  const defaults = {
    startVelocity: 32,
    spread: 360,
    ticks: 70,
    zIndex: 80,
    colors: ["#4f46e5", "#10b981", "#f59e0b", "#6366f1", "#34d399"],
  }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      window.clearInterval(interval)
      return
    }

    const particleCount = Math.round(48 * (timeLeft / durationMs))
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.05, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.95), y: Math.random() - 0.2 },
    })
  }, 220)
}
