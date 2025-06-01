"use client";
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar'; // Reuse the Sidebar component

export function MobileNavMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  // const handleSelectCategory = (categoryId: string) => {
  //   onSelectCategory(categoryId);
  //   setIsOpen(false); // Close sheet on category selection
  // }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="打开目录">
          <Menu className="h-6 w-6"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0">
        {/* Pass props to Sidebar for mobile */}
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}