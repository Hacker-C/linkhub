import React from "react";
import { cn } from "@/lib/utils";

export function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      { children }
    </h1>
  )
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className)}>
      { children }
    </h2>
  )
}
