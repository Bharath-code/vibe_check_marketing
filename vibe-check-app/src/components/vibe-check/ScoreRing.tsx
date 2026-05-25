"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  verdictBand: "hard_cringe" | "needs_work" | "clean" | "fire";
}

export default function ScoreRing({ score, verdictBand }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setAnimatedScore(score);
      return;
    }

    let start = 0;
    const duration = 600; // 600ms as per DESIGN.md
    const stepTime = Math.abs(Math.floor(duration / score));
    
    if (score === 0) return;

    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= score) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG parameters
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color based on verdict band
  let strokeColor = "var(--vc-accent)"; // cringe (red)
  if (verdictBand === "needs_work") {
    strokeColor = "var(--vc-warn)"; // needs work (orange)
  } else if (verdictBand === "clean" || verdictBand === "fire") {
    strokeColor = "var(--vc-pass)"; // success (green)
  }

  return (
    <div 
      className="flex flex-col items-center justify-center"
      role="img"
      aria-label={`Gen Z Score: ${score} out of 100, Verdict: ${verdictBand.replace("_", " ")}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Gauge */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-neutral-800/10 dark:stroke-white/10"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated fill circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 100ms ease-out" }}
          />
        </svg>

        {/* Text inside the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="font-mono text-4xl font-semibold tracking-tight text-vc-text-dark">
            {animatedScore}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mt-[-2px]">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}
