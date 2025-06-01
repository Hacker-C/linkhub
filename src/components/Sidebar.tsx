"use client";
import React, { useState } from 'react';
import { CategoryItem } from './CategoryItem';
import { Button } from '@/components/ui/button';
import { Loader2, PanelLeftIcon, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import AddCategoryModal from "@/components/categories/AddCategoryModal";
import { useParams } from "next/navigation";
import { TreeCategory } from "@/actions/categories";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";
import { useCategories } from "@/hooks/useCategories";

type SidebarContextProps = {
  open: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

export const SidebarContextProvider =  ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true)
  const toggleSidebar = React.useCallback(() => {
    return setOpen((open) => !open)
  }, [setOpen])
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      open,
      toggleSidebar,
    }),
    [open, toggleSidebar]
  )
  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
}

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuth()

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const params = useParams()
  const curCategoryId = params.categoryid as string;

  const { categories: categoriesDB, isLoading } = useCategories()

  const categories = !categoriesDB ? [] :  [...categoriesDB]
  const flag = categoriesDB?.some(category => category.id === CATEGORY_DEFAULT_ID)
  if (!flag) {
    categories.unshift({ id: CATEGORY_DEFAULT_ID, name: 'All Links', isPublic: false } as unknown as TreeCategory);
  }

  const { toggleSidebar } = useSidebar()

  return (
    <>
      <aside className="w-74 flex-col space-y-2 border-r border-border bg-card p-4 overflow-y-auto h-full">
        <div className="flex justify-between items-center px-2 mb-3 relative">
          <h2 className="text-xl font-semibold text-primary">Categories</h2>
            <PanelLeftIcon className='w-5 h-5 cursor-pointer absolute sidebar-hidden -top-2 -right-2' onClick={toggleSidebar}/>
        </div>
        <ScrollArea className="flex-1  h-[calc(100%-100px)]">
          <nav className="space-y-1">
            {
              isLoading ? <Loader2 className="animate-spin h-center-absolute" />
                :
                categories?.map((category) => {
                  const isActive = curCategoryId === category.id
                  return (
                    <div className='mt-1 w-60' key={category.id}>
                      <Link href={category.id}>
                        <CategoryItem
                          key={category.id}
                          category={category}
                          isActive={isActive}
                        />
                      </Link>
                    </div>
                  )
                })}
          </nav>
        </ScrollArea>
        {isLoggedIn && (
          <Button
            variant="outline"
            className="mt-auto w-[90%] border-dashed"
            onClick={handleAddCategoryClick} // Open modal
          >
            <Plus className="h-5 w-5 mr-2"/>
            Add Category
          </Button>
        )}
      </aside>
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}