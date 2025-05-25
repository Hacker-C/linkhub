"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutSwitcherProps {
  currentLayout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

export function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center space-x-1 border border-border rounded-lg p-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="layout-grid-btn"
              variant="ghost"
              size="icon"
              className={`p-1.5 rounded-md hover:bg-accent ${currentLayout === 'grid' ? 'active-layout-btn' : ''}`}
              onClick={() => onLayoutChange('grid')}
              aria-label="网格视图"
            >
              <LayoutGrid className={`w-5 h-5 ${currentLayout === 'grid' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>网格视图</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="layout-list-btn"
              variant="ghost"
              size="icon"
              className={`p-1.5 rounded-md hover:bg-accent ${currentLayout === 'list' ? 'active-layout-btn' : ''}`}
              onClick={() => onLayoutChange('list')}
              aria-label="列表视图"
            >
              <List className={`w-5 h-5 ${currentLayout === 'list' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>列表视图</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}