"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress"; // Assuming this is the path after shadcn add

interface HorizontalProgressBarProps extends React.ComponentPropsWithoutRef<typeof Progress> {
  value: number; // Progress value (0-100)
  // Add any other specific props if needed, or allow all Progress props
}

const HorizontalProgressBar = React.forwardRef<
  React.ElementRef<typeof Progress>,
  HorizontalProgressBarProps
>(({ className, value, ...props }, ref) => {
  return (
    <Progress
      ref={ref}
      value={value}
      className={cn("w-full h-2", className)} // Basic styling, can be adjusted
      {...props}
    />
  );
});
HorizontalProgressBar.displayName = "HorizontalProgressBar";

export { HorizontalProgressBar };
