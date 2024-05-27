import { useCallback, useEffect, useRef, useState } from "react";

export function Sparkles({ children }) {
  const [sparkles, setSparkles] = useState([]);
  useRandomInterval(
    () => {
      const now = Date.now();
      // Create a new sparkle
      const sparkle = generateSparkle();
      // Clean up any "expired" sparkles
      const nextSparkles = sparkles.filter((sparkle) => {
        const delta = now - sparkle.createdAt;
        return delta < 100;
      });
      // Include our new sparkle
      nextSparkles.push(sparkle);
      // Make it so!
      setSparkles(nextSparkles);
    },
    400,
    700
  );
  return (
    <span className="relative inline-block">
      {sparkles.map((s) => (
        <SparkleInstance key={s.id} size={s.size} style={s.style} />
      ))}
      <strong className="relative z-1 font-bold">{children}</strong>
    </span>
  );
}

const generateSparkle = () => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    // Bright yellow color:
    size: random(10, 20),
    style: {
      // Pick a random spot in the available space
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
      // Float sparkles above sibling content
      zIndex: 2,
    },
  };
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

function SparkleInstance({ size, style }) {
  return (
    <span className="animate-ping">
      <svg
        className="absolute pointer-events-none z-2 animate-spin"
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        style={style}
      >
        <path
          d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          fill="#FFC700"
        />
      </svg>
    </span>
  );
}

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    let isEnabled =
      typeof minDelay === "number" && typeof maxDelay === "number";
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};
