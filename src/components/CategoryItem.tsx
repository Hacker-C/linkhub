"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Folder,
  Globe,
  Lock,
  MoreHorizontal,
  LayoutDashboard,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { deleteCategoryById, TreeCategory } from "@/actions/categories";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmOperationAlertDialog from "@/components/ConfirmOperationAlertDialog";
import { toast } from "sonner";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";
import { useCategories } from "@/hooks/useCategories";
import { ShareCategories } from "@/components/ShareCategories";
import { useRouter } from "next/navigation";
import { usePageParams } from "@/hooks/usePageParams";

interface CategoryItemProps {
  category: TreeCategory;
  level?: number;
  handleAddCategoryClick?: (v?: boolean) => void;
}

export function CategoryItem({ category, level = 0, handleAddCategoryClick }: CategoryItemProps) {
  // Check if there are sub-categories
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  // Use the category's own state for submenu visibility
  const isSubMenuOpen = category.isSubMenuOpen || false;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // todo - handle submenu open state
  // useEffect(() => {
  //
  //   function recursiveSetSubMenuOpen(cat: TreeCategory) {
  //     if (cat?.parentId) {
  //       doOperationsOnCategoryCacheData({ id: cat.parentId } as TreeCategory, 'active')
  //       const needActiveParentCat = doOperationsOnCategoryCacheData({ id: category.parentId } as TreeCategory, 'query')
  //       if (needActiveParentCat) {
  //         recursiveSetSubMenuOpen(needActiveParentCat);
  //       }
  //     }
  //   }
  //
  //   recursiveSetSubMenuOpen(category)
  //
  // }, [isSubMenuOpen, category]);

  const { invalidateCategories, doOperationsOnCategoryCacheData } = useCategories();
  const router = useRouter();
  const curCategoryId = usePageParams('categoryid');
  const isActive = curCategoryId === category.id;
  const isDefaultCategory = category.id === CATEGORY_DEFAULT_ID;

  const handleCategoryClick = () => {
    // Toggle submenu if it has children, otherwise just select
    // if (hasSubCategories && isActive) {
    //   setIsSubMenuOpen(!isSubMenuOpen);
    // }
    doOperationsOnCategoryCacheData(category, 'active')
    // Navigate to the category's page
    router.push(isDefaultCategory ? '/admin/0' : `/admin/${category.id}`);
  };

  const onDeleteMenuItemClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (isDefaultCategory) {
      toast.error('Default category cannot be deleted!');
      return;
    }
    setDeleteDialogOpen(true);
  };

  // --- Unified Icon Logic ---
  const CategoryIcon = isDefaultCategory
    ? <LayoutDashboard className="h-5 w-5"/>
    : hasSubCategories && isSubMenuOpen
      ? <FolderOpen className="h-5 w-5"/>
      : <Folder className="h-5 w-5"/>;

  return (
    // Use Collapsible as the root for all items. It gracefully handles items
    // without content to collapse.
    <Collapsible open={isSubMenuOpen}>
      <div
        onClick={handleCategoryClick}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2.5 text-sm category-item group relative cursor-pointer",
          isActive && "category-active",
        )}
        // Consistent indentation for all items based on level
        style={{ paddingLeft: `${0.75 + level * 1.25}rem` }}
      >
        {/* --- Main content area --- */}
        <div className="flex items-center space-x-2 flex-grow min-w-0">
          {CategoryIcon}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate text-left">
                {category.name}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{category.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* --- Right-aligned metadata and actions --- */}
        <div className="flex items-center space-x-2 ml-2">
          <span className="visibility-icon" title={category.isPublic ? "Public" : "Private"}>
            {category.isPublic ? <Globe className="h-3 w-3"/> : <Lock className="h-3 w-3"/>}
          </span>
          <span className={cn("text-xs font-normal", isActive ? "text-primary" : "text-muted-foreground")}>
            {category.itemCount || '0'}
          </span>

          {/* --- Unified Dropdown Menu --- */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="category-more-actions-btn h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              {!isDefaultCategory &&
                  <DropdownMenuItem onClick={() => handleAddCategoryClick?.(true)}>Add Sub Category</DropdownMenuItem>}
              {category.isPublic &&
                  <DropdownMenuItem><ShareCategories category={category} variant='text'/></DropdownMenuItem>}
              <DropdownMenuItem>
                {category.isPublic ? "Set as private" : "Set as public"}
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive-foreground"
                onClick={onDeleteMenuItemClick}
                disabled={isDefaultCategory}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- Conditionally Rendered Sub-categories --- */}
      {hasSubCategories && (
        <CollapsibleContent className="sub-category-list space-y-0.5">
          {category.subCategories?.map(subCat => (
            <CategoryItem
              key={subCat.id}
              category={subCat}
              level={level + 1}
              handleAddCategoryClick={handleAddCategoryClick}
            />
          ))}
        </CollapsibleContent>
      )}

      {/* --- Delete confirmation dialog --- */}
      <ConfirmOperationAlertDialog
        open={deleteDialogOpen}
        onOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onOk={async () => {
          const res = await deleteCategoryById(category.id);
          if (res.errorMessage) {
            toast.error(res.errorMessage);
          } else {
            invalidateCategories();
            toast.success('Category deleted');
            setDeleteDialogOpen(false);
          }
        }}
      />
    </Collapsible>
  );
}