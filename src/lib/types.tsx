export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string; // URL to favicon
  domain: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  isPublic: boolean;
  parentId?: string | null; // For sub-categories
  subCategories?: Category[];
}