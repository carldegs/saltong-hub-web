import confetti from "canvas-confetti";
import { confettiColors } from "./summary-screen";

export const triggerSuccessConfetti = () => {
  const end = Date.now() + 3000;

  const config: confetti.Options = {
    particleCount: 4,
    spread: 55,
    startVelocity: 60,
    colors: confettiColors,
    scalar: 1,
  };

  const frame = (i = 0) => {
    if (Date.now() > end) return;

    if (i % 4 === 0) {
      confetti({
        angle: 60,
        origin: { x: 0, y: 0.75 },
        ...config,
      });
      confetti({
        angle: 120,
        origin: { x: 1, y: 0.75 },
        ...config,
      });
    }

    requestAnimationFrame(() => frame(i + 1));
  };

  frame();
};

export const triggerFailureConfetti = () => {
  const defaults: confetti.Options = {
    angle: 120,
    spread: 360,
    scalar: 2,
    ticks: 500,
    startVelocity: 10,
    colors: confettiColors,
    flat: true,
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 20,
      shapes: [confetti.shapeFromText("😥")],
      origin: { x: 0.35, y: 0 },
    });

    confetti({
      ...defaults,
      particleCount: 10,
      shapes: [confetti.shapeFromText("❌")],
      origin: { x: 0.55, y: 0 },
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 1500);
  setTimeout(shoot, 3000);
};
