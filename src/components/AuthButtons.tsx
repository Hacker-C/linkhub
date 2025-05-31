"use client";
import React from 'react';
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  className?: string;
}

export function AuthButtons({ onLoginClick, onRegisterClick, className }: AuthButtonsProps) {
  return (
    <div className={className}>
      <Button variant="ghost" onClick={onLoginClick} className="text-sm font-medium text-foreground hover:bg-accent">
        Login
      </Button>
      <Button onClick={onRegisterClick} className="text-sm font-medium">
        Sign Up
      </Button>
    </div>
  );
}