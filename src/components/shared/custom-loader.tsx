"use client";

import { useState } from "react";

const LOADER_LETTERS = "SANDALILANGLOADING".split("");
const LOADER_COLORS = ["#38E18C", "#8759F3", "#E23B3B", "#499AEE"];

export default function CustomLoader() {
  const [letterIndex, setLetterIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const handleIterate = () => {
    setLetterIndex((prev) => (prev + 1) % LOADER_LETTERS.length);
    setColorIndex((prev) => (prev + 1) % LOADER_COLORS.length);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="flex size-[72px] items-center justify-center rounded-lg text-6xl font-bold text-white"
        style={{
          background: LOADER_COLORS[colorIndex],
          animation: "flip-y 1s ease-in-out infinite",
        }}
        onAnimationIteration={handleIterate}
      >
        {LOADER_LETTERS[letterIndex]}
      </div>
    </div>
  );
}
