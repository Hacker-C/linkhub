import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TreeCategory } from "@/actions/categories";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError<D>(error: unknown): ResponseWithError<D> {
  if (error instanceof Error) {
    return { errorMessage: error.message || 'Unknown error', data: null }
  }
  return { errorMessage: 'Unknown error', data: null }
}

// Define the error response type
export type ResponseWithError<D> = { errorMessage: string | null, data?: D | null }

/**
 * Higher-order function to handle data actions with error handling
 * @param actionFn The authentication action function to execute
 * @returns A function that executes the action and handles errors
 */
export const withErrorHandle = <T, D>(actionFn: (...args: T[]) => Promise<ResponseWithError<D>>) => {
  return async (...args: T[]): Promise<ResponseWithError<D>> => {
    try {
      const result = await actionFn(...args)
      return result
    } catch (error) {
      return handleError(error)
    }
  }
}

/**
 * Builds a nested tree structure from a flat array of categories.
 * @param list
 */
export function buildTree(sqlQueryList: TreeCategory[]): TreeCategory[] {

  /**
   *  c.parent_id,
   *                  c.is_public,
   *                  c.created_at,
   *                  c.updated_at,
   *                  c.user_id,
   */
  const list = sqlQueryList.map(item => {
    return {
      ...item,
      isPublic: item['is_public' as keyof TreeCategory],
      createdAt: item['created_at' as keyof TreeCategory],
      updatedAt: item['updated_at' as keyof TreeCategory],
      userId: item['user_id' as keyof TreeCategory],
      parentId: item['parent_id' as keyof TreeCategory],
      shortId: item['short_id' as keyof TreeCategory]?.toString(),
      isSubMenuOpen: false,
    } as TreeCategory
  })

  const tree: TreeCategory[] = [];
  const map: { [key: string]: TreeCategory } = {};

  // 将数组中的每个元素放入 map 中，方便后续查找
  list.forEach(item => {
    map [item.id] = { ...item, subCategories: [] };
  });

  // 遍历数组，构建树结构
  list.forEach(item => {
    const parent = item.parentId ? map [item.parentId] : null;
    if (parent) {
      parent.subCategories!.push(map [item.id]); // 使用 ! 断言 children 存在
    } else {
      // parentId 为 null 的元素是根节点
      tree.push(map [item.id]);
    }
    if (parent) {
      parent.itemCount = (parent?.itemCount || 0) + 1
    }
  });

  return tree;
}