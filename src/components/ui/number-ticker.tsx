"use client";

import { ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  loop?: boolean;
  pauseDuration?: number;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  loop = false,
  pauseDuration = 1,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: !loop, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;

    if (loop) {
      const animationDuration = 2000; // Approximate spring animation duration in ms
      const timeouts: NodeJS.Timeout[] = [];

      const runLoop = () => {
        // Go up: animate from startValue to value
        motionValue.set(value);

        // After animation completes + pause, go back down
        const downTimeout = setTimeout(
          () => {
            motionValue.set(startValue);

            // After going back down + pause, repeat
            const repeatTimeout = setTimeout(
              () => {
                runLoop();
              },
              animationDuration + pauseDuration * 1000
            );
            timeouts.push(repeatTimeout);
          },
          animationDuration + pauseDuration * 1000
        );
        timeouts.push(downTimeout);
      };

      // Start the loop
      runLoop();

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    } else {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [
    motionValue,
    isInView,
    delay,
    value,
    direction,
    startValue,
    loop,
    pauseDuration,
  ]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces]
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  );
}
