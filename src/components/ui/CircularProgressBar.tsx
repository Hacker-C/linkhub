"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressBarProps {
  value: number; // Progress value (0-100)
  size?: number; // Diameter of the circle in pixels
  strokeWidth?: number; // Width of the progress ring stroke
  className?: string;
  // Style for the text in the middle of the progress bar
  textClassName?: string; 
}

const CircularProgressBar = ({
  value,
  size = 40, // Default size
  strokeWidth = 4, // Default stroke width
  className,
  textClassName,
}: CircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor" // Or a specific background color like theme.colors.muted
          fill="transparent"
          className="text-muted-foreground opacity-20" // Example: use Tailwind for color
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor" // Example: use Tailwind for color
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // Makes the ends of the progress line rounded
          className="text-primary" // Example: use Tailwind for color
        />
      </svg>
      {/* Optional: Display percentage text in the middle */}
      <span
        className={cn(
          "absolute text-xs font-medium text-primary", // Example: use Tailwind for color
          textClassName
        )}
      >
        {`${Math.round(value)}%`}
      </span>
    </div>
  );
};
CircularProgressBar.displayName = "CircularProgressBar";

export { CircularProgressBar };
