"use client";

interface VerdictBadgeProps {
  verdictBand: "hard_cringe" | "needs_work" | "clean" | "fire";
  label: string;
}

export default function VerdictBadge({ verdictBand, label }: VerdictBadgeProps) {
  // Determine text color and borders based on verdict
  let borderClass = "border-[#ff5c4d] text-[#ff5c4d] bg-[#ff5c4d]/5";
  let animateClass = "animate-stamp-cringe";

  if (verdictBand === "needs_work") {
    borderClass = "border-[#f5a623] text-[#f5a623] bg-[#f5a623]/5";
    animateClass = "animate-stamp-needs";
  } else if (verdictBand === "clean") {
    borderClass = "border-[#3ddba0] text-[#3ddba0] bg-[#3ddba0]/5";
    animateClass = "animate-stamp-clean";
  } else if (verdictBand === "fire") {
    borderClass = "border-[#3ddba0] text-[#3ddba0] bg-[#3ddba0]/5";
    animateClass = "animate-stamp-fire";
  }

  return (
    <div className="flex flex-col items-center select-none py-1">
      <div 
        className={`px-5 py-2 border-[3px] border-dashed font-display text-2xl font-bold uppercase tracking-wider rounded-md ${borderClass} ${animateClass} inline-block shadow-sm`}
        style={{
          transformOrigin: "center center",
        }}
      >
        {label}
      </div>
    </div>
  );
}
