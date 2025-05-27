"use client";
import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Folder, Globe, Lock, ChevronRight, MoreHorizontal, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onSelectCategory: (categoryId: string) => void;
  onToggleVisibility: (categoryId: string, isPublic: boolean) => void;
  level?: number;
}

export function CategoryItem({ category, isActive, onSelectCategory, onToggleVisibility, level = 0 }: CategoryItemProps) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // For multi-level, default to true if active parent
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  const handleCategoryClick = (e: React.MouseEvent) => {
    if (hasSubCategories) {
      // If it's a parent with subcategories, let CollapsibleTrigger handle it
      // or if user clicks directly on the name part, toggle and select
      if (!(e.target as HTMLElement).closest('.collapsible-trigger-button') && !(e.target as HTMLElement).closest('.category-more-actions-btn')) {
        setIsSubMenuOpen(!isSubMenuOpen);
      }
    }
    if (!(e.target as HTMLElement).closest('.category-more-actions-btn')) {
      onSelectCategory(category.id);
    }
  };

  const CategoryLinkContent = () => (
    <>
      <div className="flex items-center space-x-2 flex-grow">
        {level === 0 && (category.id === 'all' ? <LayoutDashboard className="h-5 w-5" /> : <Folder className="h-5 w-5" />)}
        <span className={cn("truncate", level > 0 && "text-sm")}>{category.name}</span>
        <span className="visibility-icon" title={category.isPublic ? "公开" : "私有"}>
          {category.isPublic ? <Globe className="h-3 w-3"/> : <Lock className="h-3 w-3"/>}
        </span>
      </div>
      <span className={cn("ml-auto text-xs font-normal", isActive ? "text-primary" : "text-muted-foreground")}>
        {category.itemCount}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="category-more-actions-btn h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={() => onToggleVisibility(category.id, !category.isPublic)}>
            {category.isPublic ? "设为私有" : "设为公开"}
          </DropdownMenuItem>
          <DropdownMenuItem>重命名</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive-foreground">删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );


  if (hasSubCategories) {
    return (
      <Collapsible open={isSubMenuOpen} onOpenChange={setIsSubMenuOpen}>
        <div
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2.5 text-sm category-item group relative cursor-pointer",
            isActive && !isSubMenuOpen && "category-active", // Active only if not expanded or if it's the one selected
            level > 0 && "pl-4" // Indent sub-categories
          )}
          style={{ paddingLeft: `${0.75 + level * 0.75}rem` }}
          onClick={handleCategoryClick}
        >
          <div className="flex items-center space-x-2 flex-grow">
            <CollapsibleTrigger asChild className="collapsible-trigger-button -ml-1 mr-1">
              <Button variant="ghost" size="icon" className={cn("h-6 w-6 p-0", isActive && "text-primary")}>
                <ChevronRight className={cn("h-4 w-4 chevron-icon", isSubMenuOpen && "rotate-90")} />
              </Button>
            </CollapsibleTrigger>
            {level === 0 && (category.id === 'all' ? <LayoutDashboard className="h-5 w-5" /> : <Folder className="h-5 w-5" />)}
            <span className="truncate">{category.name}</span>
            <span className="visibility-icon" title={category.isPublic ? "公开" : "私有"}>
              {category.isPublic ? <Globe className="h-3 w-3"/> : <Lock className="h-3 w-3"/>}
            </span>
          </div>
          <span className={cn("ml-auto text-xs font-normal mr-1", isActive ? "text-primary" : "text-muted-foreground")}>
            {category.itemCount}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="category-more-actions-btn h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onToggleVisibility(category.id, !category.isPublic)}>
                {category.isPublic ? "设为私有" : "设为公开"}
              </DropdownMenuItem>
              <DropdownMenuItem>重命名</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive-foreground">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CollapsibleContent className="sub-category-list space-y-0.5">
          {category.subCategories?.map(subCat => (
            <CategoryItem
              key={subCat.id}
              category={subCat}
              isActive={isActive && subCat.id === category.id} // This logic needs refinement for deep active state
              onSelectCategory={onSelectCategory}
              onToggleVisibility={onToggleVisibility}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div
      onClick={handleCategoryClick}
      className={cn(
        "flex items-center space-x-2 rounded-md px-3 py-2.5 text-sm category-item group relative cursor-pointer",
        isActive && "category-active",
        level > 0 && "pl-4" // Indent sub-categories
      )}
      style={{ paddingLeft: `${0.75 + level * 0.75}rem` }}
    >
      <CategoryLinkContent />
    </div>
  );
}
