"use client"

import React from 'react';
import { BookmarkList } from '@/components/BookmarkList';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw } from 'lucide-react';
import { MobileNavMenu } from '@/components/MobileNavMenu';
import AddBookmarkModal from "@/components/bookmarks/AddBookmarkModal";
import { useBookmarkList } from "@/hooks/useBookmarkList";
import { usePageParams } from "@/hooks/usePageParams";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";
import { ShareCategories } from "@/components/ShareCategories";
import { useCategories } from "@/hooks/useCategories";
import useSafeLocalStorage from "@/hooks/useSafeLocalStorage";
import { TreeCategory } from "@/actions/categories";

export default function AdminPage() {
  const [layout, setLayout] = useSafeLocalStorage<'grid' | 'list'>('bookmark-list-layout', 'grid')
  const { refetch } = useBookmarkList()

  const categoryid = usePageParams('categoryid')
  const { doOperationsOnCategoryCacheData } = useCategories()
  const category = doOperationsOnCategoryCacheData({ id: categoryid } as TreeCategory, 'query')
  const categoryName = categoryid === CATEGORY_DEFAULT_ID ?  'All Links' : category?.name

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleAddBookmark = () => {
    setIsOpen(true)
  }


  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/20">
      {/* Mobile Header (inside main for scrolling) */}
      <header className="md:hidden flex items-center justify-between mb-6">
        <MobileNavMenu />
        <h2 id="mobile-page-title" className="text-xl font-semibold text-primary">
          {categoryName}
        </h2>
        <div className="w-8"></div> {/* Spacer for centering title */}
      </header>

      {/* Desktop Header for main content area */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <h2 id="desktop-page-title" className="text-2xl font-semibold text-foreground">
          {categoryName}
        </h2>
        <div className="flex items-center space-x-4">
          <SearchInput />
          <Button variant="ghost" className="rounded-full" onClick={() => refetch()}>
            <RotateCcw />
          </Button>
          {
            categoryid !== CATEGORY_DEFAULT_ID
              && category?.isPublic
              && <ShareCategories category={category as TreeCategory} variant='icon' />
          }
          <LayoutSwitcher currentLayout={layout!} onLayoutChange={setLayout} />
          <Button onClick={handleAddBookmark}>
            <Plus className="h-5 w-5 mr-2" />
            Add link
          </Button>
        </div>
      </div>

      <BookmarkList layout={layout!} />

      {/* Mobile Add IBookmark FAB */}
      <Button
        size="icon"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={handleAddBookmark}
        aria-label="Add link"
      >
        <Plus className="h-7 w-7" />
      </Button>
      <AddBookmarkModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}