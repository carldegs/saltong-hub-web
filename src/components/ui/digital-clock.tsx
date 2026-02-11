"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TimeInterval {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface DigitalClockProps {
  className?: string;
  showSeconds?: boolean;
  use24Hour?: boolean;
  color?: string;
  /** Scale factor for the clock size (default: 1) */
  scale?: number;
  /** Either a time interval object or text to display */
  value: TimeInterval | string;
  offColor?: string;
  /** Force showing days even when it is 0 */
  showDays?: boolean;
  /** Force showing hours even when it is 0 */
  showHours?: boolean;
}

export function DigitalClock({
  className,
  showSeconds = true,
  use24Hour = true,
  color = "#82FA58",
  scale = 1,
  value,
  offColor: _offColor,
  showDays,
  showHours,
}: DigitalClockProps) {
  const { resolvedTheme } = useTheme();
  const offColor = _offColor ?? (resolvedTheme === "dark" ? "#333" : "#ddd");

  // If value is a string, render as text
  if (typeof value === "string") {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        {value.split("").map((char, i) => (
          <Digit
            key={i}
            digit={char}
            color={color}
            offColor={offColor}
            scale={scale}
          />
        ))}
      </div>
    );
  }

  // Otherwise, render as time interval
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = value;

  let hoursVal = hours;
  if (!use24Hour) {
    hoursVal = hoursVal % 12 === 0 ? 12 : hoursVal % 12;
  }

  const hourTens = Math.floor(hoursVal / 10);
  const hourOnes = hoursVal % 10;
  const minTens = Math.floor(minutes / 10);
  const minOnes = minutes % 10;
  const secTens = Math.floor(seconds / 10);
  const secOnes = seconds % 10;

  const shouldShowDays = showDays ?? (typeof days === "number" && days > 0);
  const shouldShowHours =
    showHours ?? (days > 0 || hourOnes > 0 || hourTens > 0);

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {shouldShowDays && (
        <>
          {(days > 0 ? String(days) : "0").split("").map((d, i) => (
            <Digit
              key={`day-${i}`}
              digit={Number(d)}
              color={color}
              offColor={offColor}
              scale={scale}
            />
          ))}
          <Colon color={color} offColor={offColor} scale={scale} />
        </>
      )}
      {shouldShowHours && (
        <>
          <Digit
            digit={hourTens}
            color={color}
            offColor={offColor}
            scale={scale}
          />
          <Digit
            digit={hourOnes}
            color={color}
            offColor={offColor}
            scale={scale}
          />
          <Colon color={color} offColor={offColor} scale={scale} />
        </>
      )}

      <Digit digit={minTens} color={color} offColor={offColor} scale={scale} />
      <Digit digit={minOnes} color={color} offColor={offColor} scale={scale} />
      {showSeconds && (
        <>
          <Colon color={color} offColor={offColor} scale={scale} />
          <Digit
            digit={secTens}
            color={color}
            offColor={offColor}
            scale={scale}
          />
          <Digit
            digit={secOnes}
            color={color}
            offColor={offColor}
            scale={scale}
          />
        </>
      )}
    </div>
  );
}

function Colon({
  color,
  offColor,
  visible = true,
  scale = 1,
}: {
  color: string;
  offColor: string;
  visible?: boolean;
  scale?: number;
}) {
  const displayColor = visible ? color : offColor;
  const s = scale;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: `${10 * s}px`,
        height: `${110 * s}px`,
        marginLeft: `${8 * s}px`,
        marginRight: `${8 * s}px`,
        gap: `${15 * s}px`,
      }}
    >
      <div
        style={{
          width: `${10 * s}px`,
          height: `${10 * s}px`,
          backgroundColor: displayColor,
        }}
      />
      <div
        style={{
          width: `${10 * s}px`,
          height: `${10 * s}px`,
          backgroundColor: displayColor,
        }}
      />
    </div>
  );
}

function Digit({
  digit,
  color,
  offColor,
  scale = 1,
}: {
  digit: number | string;
  color: string;
  offColor: string;
  scale?: number;
}) {
  const off = offColor;
  const s = scale;

  // Segment patterns for digits 0-9
  // [top, middle, bottom, topLeft, topRight, bottomLeft, bottomRight]
  const patterns: Record<number, boolean[]> = {
    0: [true, false, true, true, true, true, true],
    1: [false, false, false, false, true, false, true],
    2: [true, true, true, false, true, true, false],
    3: [true, true, true, false, true, false, true],
    4: [false, true, false, true, true, false, true],
    5: [true, true, true, true, false, false, true],
    6: [true, true, true, true, false, true, true],
    7: [true, false, false, false, true, false, true],
    8: [true, true, true, true, true, true, true],
    9: [true, true, true, true, true, false, true],
  };

  // Letter patterns for limited set: F, A, I, L
  const letterPatterns: Record<string, boolean[]> = {
    A: [true, true, false, true, true, true, true],
    F: [true, true, false, true, false, true, false],
    I: [false, false, false, false, true, false, true],
    L: [false, false, true, true, false, true, false],
  };

  let p: boolean[] = patterns[0];
  if (typeof digit === "number") {
    p = patterns[digit] || patterns[0];
  } else {
    const ch = String(digit).toUpperCase();
    if (letterPatterns[ch]) p = letterPatterns[ch];
    else {
      const n = Number(ch);
      p = !Number.isNaN(n) ? patterns[n] || patterns[0] : patterns[0];
    }
  }

  // All dimensions scaled
  const w = 60 * s;
  const h = 110 * s;
  const seg = 10 * s;
  const inner = 50 * s;
  const vSeg = 40 * s;

  // Build gradient for 7-segment display
  const background = `
    linear-gradient(90deg, transparent ${seg}px, ${p[0] ? color : off} ${seg}px, ${p[0] ? color : off} ${inner}px, transparent ${inner}px),
    linear-gradient(90deg, transparent ${seg}px, ${p[1] ? color : off} ${seg}px, ${p[1] ? color : off} ${inner}px, transparent ${inner}px),
    linear-gradient(90deg, transparent ${seg}px, ${p[2] ? color : off} ${seg}px, ${p[2] ? color : off} ${inner}px, transparent ${inner}px),
    linear-gradient(90deg, ${p[3] ? color : off} ${seg}px, transparent ${seg}px, transparent ${inner}px, ${p[4] ? color : off} ${inner}px),
    linear-gradient(90deg, ${p[5] ? color : off} ${seg}px, transparent ${seg}px, transparent ${inner}px, ${p[6] ? color : off} ${inner}px)
  `;

  return (
    <div
      className="relative"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        marginLeft: `${5 * s}px`,
        marginRight: `${5 * s}px`,
        backgroundImage: background,
        backgroundPosition: `0 0, 0 ${inner}px, 0 ${h - seg}px, 0 ${seg}px, 0 ${h / 2 + seg / 2}px`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${w}px ${seg}px, ${w}px ${seg}px, ${w}px ${seg}px, ${w}px ${vSeg}px, ${w}px ${vSeg}px`,
      }}
    />
  );
}
