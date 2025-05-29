"use client";
import React, { useState } from 'react';
import { CategoryItem } from './CategoryItem';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import AddCategoryModal from "@/components/categories/AddCategoryModal";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryCategories, TreeCategory } from "@/actions/categories";
import { toast } from "sonner";
import Link from "next/link";

interface SidebarProps {
  onToggleCategoryVisibility: (categoryId: string, isPublic: boolean) => void;
  isLoggedIn: boolean;
}

export function Sidebar({
                          onToggleCategoryVisibility,
                          isLoggedIn
                        }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const params = useParams()
  const curCategoryId = params.categoryid as string;

  const { data: categoriesDB, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await queryCategories()
      if (res.errorMessage || !res.data) {
        toast.error(res.errorMessage)
      }
      return res.data
    },
  })

  const categories = !categoriesDB ? [] :  [...categoriesDB]
  const flag = categoriesDB?.some(category => category.id === '0')
  if (!flag) {
    categories.unshift({ id: '0', name: 'All link', isPublic: false } as unknown as TreeCategory);
  }

  return (
    <>
      <aside className="w-64 flex-col space-y-2 border-r border-border bg-card p-4 overflow-y-auto h-full">
        <div className="flex justify-between items-center px-2 mb-3">
          <h2 className="text-xl font-semibold text-primary">目录</h2>
        </div>
        <ScrollArea className="flex-1 pr-3 h-[calc(100%-100px)]">
          <nav className="space-y-1">
            {
              isLoading ? <Loader2 className="animate-spin h-center-absolute" /> :
                categories?.map((category) => {
                  const isActive = curCategoryId === category.id
                  return (
                    <div className='mt-1' key={category.id}>
                      <Link href={category.id}>
                        <CategoryItem
                          key={category.id}
                          category={category}
                          isActive={isActive}
                          onToggleVisibility={onToggleCategoryVisibility}
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
            className="mt-auto w-full border-dashed"
            onClick={handleAddCategoryClick} // Open modal
          >
            <Plus className="h-5 w-5 mr-2"/>
            添加分类
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