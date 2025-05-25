"use client";
import React from 'react';
import { Category } from '@/lib/types';
import { CategoryItem } from './CategoryItem';
import { Button } from '@/components/ui/button';
import { Icons } from './icons';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onToggleCategoryVisibility: (categoryId: string, isPublic: boolean) => void;
  onAddCategory: () => void;
  isLoggedIn: boolean;
}

export function Sidebar({
                          categories,
                          activeCategoryId,
                          onSelectCategory,
                          onToggleCategoryVisibility,
                          onAddCategory,
                          isLoggedIn
                        }: SidebarProps) {
  return (
    <aside className="w-64 flex-col space-y-2 border-r border-border bg-card p-4 overflow-y-auto h-full">
      <div className="flex justify-between items-center px-2 mb-3">
        <h2 className="text-xl font-semibold text-primary">目录</h2>
      </div>
      <ScrollArea className="flex-1 pr-3 h-[calc(100%-100px)]"> {/* Adjust height as needed */}
        <nav className="space-y-1">
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={activeCategoryId === category.id}
              onSelectCategory={onSelectCategory}
              onToggleVisibility={onToggleCategoryVisibility}
            />
          ))}
        </nav>
      </ScrollArea>
      {isLoggedIn && (
        <Button
          variant="outline"
          className="mt-auto w-full border-dashed"
          onClick={onAddCategory}
        >
          <Icons.add className="h-5 w-5 mr-2" />
          添加分类
        </Button>
      )}
    </aside>
  );
}