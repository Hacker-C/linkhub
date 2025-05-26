"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface SidebarToggleButtonProps {
  isSidebarOpen: boolean;
  onClick: () => void;
}

export const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isSidebarOpen, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      className={`hidden md:inline-flex fixed top-16 z-50 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'left-[260px]' : 'left-2'
      }`}
      aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
    </Button>
  );
};
