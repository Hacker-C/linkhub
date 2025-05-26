"use client";
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar'; // Reuse the Sidebar component
import { Category } from '@/lib/types';

interface MobileNavMenuProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onToggleCategoryVisibility: (categoryId: string, isPublic: boolean) => void;
  onAddCategory: () => void;
  isLoggedIn: boolean;
}

export function MobileNavMenu({
                                categories,
                                activeCategoryId,
                                onSelectCategory,
                                onToggleCategoryVisibility,
                                onAddCategory,
                                isLoggedIn
                              }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false); // Close sheet on category selection
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="打开目录">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0">
        {/* Pass props to Sidebar for mobile */}
        <Sidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory} // Use wrapped handler
          onToggleCategoryVisibility={onToggleCategoryVisibility}
          onAddCategory={onAddCategory}
          isLoggedIn={isLoggedIn}
        />
      </SheetContent>
    </Sheet>
  );
}